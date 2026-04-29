const SUPABASE_URL = 'https://nbmvodklvnmnuntbmvvb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ibXZvZGtsdm5tbnVudGJtdnZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5OTA1ODcsImV4cCI6MjA4OTU2NjU4N30.JcpIlozE-J2DmcCExeNWt0pgtDBL70VX7jAXOBnix6E';
const CAPTCHA_PROVIDER = 'turnstile'; // 'turnstile' or 'hcaptcha'
const CAPTCHA_SITE_KEY = '0x4AAAAAACu3ttLPmMW90mOW'; // Optional: set your hCaptcha/Turnstile site key if Supabase CAPTCHA protection is enabled

// Single global Supabase client — all pages use window.sb
window.sb = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Shared auth/session helpers — use these across pages to avoid auth drift.
window.authUtils = window.authUtils || {
	async getCurrentUser() {
		if (!window.sb?.auth) return null;

		const { data: { session } } = await window.sb.auth.getSession();
		if (session?.user) return session.user;

		const { data: { user } } = await window.sb.auth.getUser();
		return user || null;
	},

	onAuthStateChange(callback) {
		if (!window.sb?.auth?.onAuthStateChange || typeof callback !== 'function') {
			return null;
		}

		return window.sb.auth.onAuthStateChange((_event, session) => {
			callback(session?.user || null, session);
		});
	},

	async getProfile(userId, fields = 'username, is_admin') {
		if (!window.sb || !userId) return null;
		const { data } = await window.sb.from('profiles').select(fields).eq('id', userId).single();
		return data || null;
	}
};

window.realtimeUtils = window.realtimeUtils || {
	subscribe({ table, filter, schema = 'public', events = '*', onChange, channelName }) {
		if (!window.sb?.channel || !table || typeof onChange !== 'function') {
			return null;
		}

		const name = channelName || `rt_${table}_${Math.random().toString(36).slice(2, 8)}`;
		const channel = window.sb
			.channel(name)
			.on('postgres_changes', {
				event: events,
				schema,
				table,
				...(filter ? { filter } : {})
			}, onChange)
			.subscribe();

		return channel;
	},

	unsubscribe(channel) {
		if (!channel || !window.sb?.removeChannel) return;
		window.sb.removeChannel(channel);
	}
};

(function injectIdentityStyles() {
  if (!document?.head || document.getElementById('identity-link-styles')) return;
  const style = document.createElement('style');
  style.id = 'identity-link-styles';
  style.textContent = `
    a[href^="profile.html?id="] {
      display: inline-flex !important;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid rgba(232, 200, 74, 0.18);
      background: rgba(232, 200, 74, 0.06);
      color: var(--gold, #e8c84a) !important;
      text-decoration: none !important;
      font-weight: 600;
      line-height: 1.2;
      transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease, opacity 0.2s ease;
    }
    a[href^="profile.html?id="]:hover {
      background: rgba(232, 200, 74, 0.11);
      border-color: rgba(232, 200, 74, 0.34);
      transform: translateY(-1px);
    }
    a[href="admin.html"] {
      display: inline-flex !important;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      border-radius: 999px;
      border: 1px solid rgba(232, 200, 74, 0.28) !important;
      background: linear-gradient(180deg, rgba(232, 200, 74, 0.14), rgba(232, 200, 74, 0.06));
      color: var(--gold, #e8c84a) !important;
      text-decoration: none !important;
      font-weight: 700;
      letter-spacing: 0.3px;
      box-shadow: 0 10px 24px rgba(232, 200, 74, 0.08);
    }
    a[href="admin.html"]:hover {
      background: linear-gradient(180deg, rgba(232, 200, 74, 0.18), rgba(232, 200, 74, 0.08));
      transform: translateY(-1px);
    }
  `;
  document.head.appendChild(style);
})();

// ── TOAST NOTIFICATIONS ──────────────────────────────────────────────────────
window.toastUtils = window.toastUtils || (() => {
  let container = null;

  function getContainer() {
    if (container && document.body.contains(container)) return container;
    container = document.createElement('div');
    container.id = 'toast-container';
    container.style.cssText = [
      'position:fixed', 'bottom:24px', 'right:24px', 'z-index:9999',
      'display:flex', 'flex-direction:column', 'gap:8px',
      'pointer-events:none', 'max-width:320px'
    ].join(';');
    document.body.appendChild(container);
    return container;
  }

  const ICONS = { success: '✓', error: '✕', info: 'ℹ', warning: '⚠' };
  const COLORS = {
    success: { bg: 'rgba(50,200,100,0.12)', border: 'rgba(50,200,100,0.35)', text: '#5cdb95' },
    error:   { bg: 'rgba(220,50,50,0.12)',  border: 'rgba(220,50,50,0.35)',  text: '#ff6b6b' },
    info:    { bg: 'rgba(232,200,74,0.10)', border: 'rgba(232,200,74,0.35)', text: '#e8c84a' },
    warning: { bg: 'rgba(255,160,50,0.12)', border: 'rgba(255,160,50,0.35)', text: '#ffaa44' }
  };

  function show(message, type = 'success', duration = 3000) {
    const c = getContainer();
    const col = COLORS[type] || COLORS.info;
    const icon = ICONS[type] || 'ℹ';

    const toast = document.createElement('div');
    toast.style.cssText = [
      `background:${col.bg}`, `border:1px solid ${col.border}`,
      'border-radius:4px', 'padding:11px 14px',
      'display:flex', 'align-items:center', 'gap:10px',
      'font-family:Barlow,sans-serif', 'font-size:13px',
      `color:${col.text}`, 'pointer-events:auto',
      'backdrop-filter:blur(8px)',
      'opacity:0', 'transform:translateY(8px)',
      'transition:opacity 0.2s ease, transform 0.2s ease',
      'box-shadow:0 4px 16px rgba(0,0,0,0.4)'
    ].join(';');

    toast.innerHTML = `
      <span style="font-size:15px;flex-shrink:0;">${icon}</span>
      <span style="flex:1;color:#e0e0e0;">${String(message)}</span>
      <button onclick="this.parentElement.remove()" style="background:none;border:none;color:#555;cursor:pointer;font-size:14px;padding:0;line-height:1;flex-shrink:0;">✕</button>`;

    c.appendChild(toast);
    requestAnimationFrame(() => {
      toast.style.opacity = '1';
      toast.style.transform = 'translateY(0)';
    });

    if (duration > 0) {
      setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(8px)';
        setTimeout(() => toast.remove(), 220);
      }, duration);
    }
    return toast;
  }

  return {
    success: (msg, dur) => show(msg, 'success', dur),
    error:   (msg, dur) => show(msg, 'error',   dur),
    info:    (msg, dur) => show(msg, 'info',     dur),
    warning: (msg, dur) => show(msg, 'warning',  dur),
    show
  };
})();

// ── SKELETON LOADER ───────────────────────────────────────────────────────────
window.skeletonUtils = window.skeletonUtils || {
  // Inject keyframe animation once
  _injected: false,
  _inject() {
    if (this._injected || !document.head) return;
    this._injected = true;
    const s = document.createElement('style');
    s.textContent = `
      @keyframes skeleton-shimmer {
        0%   { background-position: -400px 0; }
        100% { background-position:  400px 0; }
      }
      .skeleton-line {
        background: linear-gradient(90deg, #1a1a1a 25%, #242424 50%, #1a1a1a 75%);
        background-size: 800px 100%;
        animation: skeleton-shimmer 1.4s infinite linear;
        border-radius: 3px;
      }`;
    document.head.appendChild(s);
  },

  // Returns HTML for a single skeleton card matching the site's content-card style
  card() {
    this._inject();
    return `
      <div style="background:#141414;border:1px solid #222;border-radius:4px;padding:20px;display:flex;flex-direction:column;gap:10px;">
        <div class="skeleton-line" style="height:10px;width:40%;"></div>
        <div class="skeleton-line" style="height:16px;width:85%;"></div>
        <div class="skeleton-line" style="height:16px;width:65%;"></div>
        <div class="skeleton-line" style="height:11px;width:30%;margin-top:4px;"></div>
      </div>`;
  },

  // Returns a grid of N skeleton cards
  grid(n = 6) {
    this._inject();
    const cards = Array.from({ length: n }, () => this.card()).join('');
    return `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;">${cards}</div>`;
  },

  // Skeleton for a post list item (profile page)
  listItem() {
    this._inject();
    return `
      <div style="background:#0f0f0f;border:1px solid #222;padding:18px 20px;margin-bottom:10px;border-radius:4px;display:flex;justify-content:space-between;align-items:center;gap:16px;">
        <div style="flex:1;display:flex;flex-direction:column;gap:8px;">
          <div class="skeleton-line" style="height:10px;width:25%;"></div>
          <div class="skeleton-line" style="height:15px;width:70%;"></div>
        </div>
        <div class="skeleton-line" style="height:22px;width:60px;border-radius:2px;"></div>
      </div>`;
  },

  // Skeleton for comment cards
  comment() {
    this._inject();
    return `
      <div style="background:#0f0f0f;border:1px solid #222;padding:20px;border-radius:4px;margin-bottom:12px;display:flex;flex-direction:column;gap:8px;">
        <div class="skeleton-line" style="height:11px;width:20%;"></div>
        <div class="skeleton-line" style="height:14px;width:90%;"></div>
        <div class="skeleton-line" style="height:14px;width:75%;"></div>
      </div>`;
  }
};

// ── CONTENT UTILITIES (reading time, share) ───────────────────────────────────
window.contentUtils = window.contentUtils || {
  // Estimate reading time from plain text (avg 200 wpm)
  readingTime(text) {
    const words = (text || '').trim().split(/\s+/).filter(Boolean).length;
    const mins = Math.max(1, Math.round(words / 200));
    return `${mins} min read`;
  },

  // Copy URL to clipboard and show a toast
  async share(url, title) {
    const shareUrl = url || window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: title || document.title, url: shareUrl });
        return;
      }
      await navigator.clipboard.writeText(shareUrl);
      window.toastUtils.success('Link copied to clipboard!');
    } catch {
      // Fallback for older browsers
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      ta.remove();
      window.toastUtils.success('Link copied to clipboard!');
    }
  }
};
