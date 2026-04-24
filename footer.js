(() => {
  const navigationLinks = [
    { label: 'Home', href: 'index.html', match: ['index.html', ''] },
    { label: 'Guides', href: 'guides.html', match: ['guides.html'] },
    { label: 'Blog', href: 'blog.html', match: ['blog.html'] },
    { label: 'Tier Lists', href: 'tierlists.html', match: ['tierlists.html'] },
    { label: 'Pro Settings', href: 'prosettings.html', match: ['prosettings.html'] },
    { label: 'Renders', href: 'renders-wallpapers.html', match: ['renders-wallpapers.html'] },
    { label: 'Assets', href: 'game-assets.html', match: ['game-assets.html'] },
    { label: 'Leaderboard', href: 'leaderboard.html', match: ['leaderboard.html'] },
    { label: 'About Us', href: 'about.html', match: ['about.html'] },
  ];

  const linkDefinitions = {
    support: {
      label: 'Support Me',
      href: 'https://ko-fi.com/marineofps',
      color: '#FF5E5B',
      target: '_blank',
    },
    discord: {
      label: 'Discord',
      href: 'https://discord.gg/b3KebadbpA',
      color: '#5865F2',
      target: '_blank',
    },
    leaderboard: {
      label: 'Leaderboards',
      href: 'leaderboard.html',
      color: 'var(--gold)',
      target: '',
    },
  };

  function escapeHtml(value) {
    return String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getCurrentPageName() {
    const path = window.location.pathname.split('/').pop() || 'index.html';
    return path.toLowerCase();
  }

  function isActiveLink(link) {
    const current = getCurrentPageName();
    return link.match.includes(current);
  }

  function injectNavigationStyles() {
    if (document.getElementById('marineo-nav-styles')) {
      return;
    }

    const style = document.createElement('style');
    style.id = 'marineo-nav-styles';
    style.textContent = `
      nav.marineo-nav {
        position: sticky;
        top: 0;
        z-index: 1000;
        background: rgba(8, 8, 8, 0.94);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(14px);
      }

      .marineo-nav-shell {
        max-width: 1240px;
        margin: 0 auto;
        padding: 0 24px;
        min-height: 64px;
        display: flex;
        align-items: center;
        gap: 18px;
      }

      .marineo-nav-brand {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        font-family: 'Barlow Condensed', sans-serif;
        font-size: 22px;
        font-weight: 700;
        letter-spacing: 2px;
        color: #e8c84a;
        text-decoration: none;
        white-space: nowrap;
        flex-shrink: 0;
      }

      .marineo-nav-brand span {
        color: #fff;
      }

      .marineo-nav-links {
        flex: 1;
        display: flex;
        align-items: center;
        gap: 18px;
        flex-wrap: wrap;
        justify-content: center;
      }

      .marineo-nav-links a {
        position: relative;
        font-size: 13px;
        font-weight: 500;
        color: #999;
        text-decoration: none;
        transition: color 0.2s ease, opacity 0.2s ease;
        white-space: nowrap;
      }

      .marineo-nav-links a:hover {
        color: #e8c84a;
      }

      .marineo-nav-links a.active {
        color: #e8c84a;
      }

      .marineo-nav-links a.active::after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        bottom: -18px;
        height: 2px;
        background: #e8c84a;
      }

      .marineo-nav-actions {
        display: flex;
        align-items: center;
        justify-content: flex-end;
        gap: 10px;
        flex-shrink: 0;
      }

      .marineo-nav-actions .btn-login,
      .marineo-nav-actions .btn-signup,
      .marineo-nav-actions .btn-logout,
      .marineo-nav-actions a {
        font-family: inherit;
      }

      .marineo-nav-actions .btn-login,
      .marineo-nav-actions .btn-logout {
        font-size: 12px;
        padding: 7px 14px;
        background: transparent;
        border: 1px solid rgba(42, 42, 42, 0.95);
        color: #999;
        border-radius: 4px;
        text-decoration: none;
        cursor: pointer;
        transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
      }

      .marineo-nav-actions .btn-login:hover,
      .marineo-nav-actions .btn-logout:hover {
        color: #fff;
        border-color: rgba(232, 200, 74, 0.35);
        background: rgba(232, 200, 74, 0.06);
      }

      .marineo-nav-actions .btn-signup {
        font-size: 12px;
        padding: 7px 14px;
        background: #e8c84a;
        color: #080808;
        border: none;
        border-radius: 4px;
        text-decoration: none;
        font-weight: 700;
        cursor: pointer;
      }

      .marineo-nav-actions .nav-profile-link {
        font-size: 12px;
        color: #e0e0e0;
        text-decoration: none;
        max-width: 170px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .marineo-nav-actions .nav-admin-link {
        font-size: 12px;
        color: #e8c84a;
        text-decoration: none;
        border: 1px solid rgba(232, 200, 74, 0.25);
        padding: 7px 12px;
        border-radius: 4px;
        white-space: nowrap;
      }

      @media (max-width: 1024px) {
        .marineo-nav-shell {
          flex-wrap: wrap;
          padding: 10px 16px 14px;
        }

        .marineo-nav-links {
          order: 3;
          width: 100%;
          justify-content: flex-start;
          gap: 14px 18px;
          padding-top: 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
        }

        .marineo-nav-links a.active::after {
          bottom: -10px;
        }

        .marineo-nav-actions {
          margin-left: auto;
        }
      }

      @media (max-width: 640px) {
        .marineo-nav-shell {
          gap: 12px;
        }

        .marineo-nav-links {
          gap: 10px 14px;
        }

        .marineo-nav-brand {
          font-size: 20px;
        }

        .marineo-nav-actions {
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
        }

        .marineo-nav-actions .nav-profile-link {
          max-width: 100%;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function buildGuestActions() {
    return `
      <a class="btn-login" href="login.html">Log in</a>
      <a class="btn-signup" href="signup.html">Sign up</a>
    `;
  }

  function buildAuthenticatedActions(user, profile) {
    const isAdmin = !!profile?.is_admin;
    const username = escapeHtml(profile?.username || user?.email || 'Profile');
    const profileHref = user?.id ? `profile.html?id=${encodeURIComponent(user.id)}` : 'profile.html';

    return `
      <a class="nav-profile-link" href="${profileHref}">${username}</a>
      <a class="btn-login" href="create.html">Create</a>
      ${isAdmin ? '<a class="nav-admin-link" href="admin.html">Admin</a>' : ''}
      <button class="btn-logout" type="button" data-nav-logout>Log out</button>
    `;
  }

  function renderNavigationShell() {
    document.querySelectorAll('nav').forEach(nav => {
      nav.classList.add('marineo-nav');
      nav.innerHTML = `
        <div class="marineo-nav-shell">
          <a class="marineo-nav-brand" href="index.html">MARINEO<span>FPS</span></a>
          <div class="marineo-nav-links">
            ${navigationLinks.map(link => `<a href="${link.href}"${isActiveLink(link) ? ' class="active"' : ''}>${link.label}</a>`).join('')}
          </div>
          <div class="marineo-nav-actions" id="nav-right">
            ${buildGuestActions()}
          </div>
        </div>
      `;
    });
  }

  async function syncNavigationAuth() {
    const navRight = document.getElementById('nav-right');
    if (!navRight || !window.sb?.auth?.getUser) {
      return;
    }

    try {
      const { data: { user } } = await window.sb.auth.getUser();
      if (!user) {
        navRight.innerHTML = buildGuestActions();
        return;
      }

      const { data: profile } = await window.sb.from('profiles').select('username, is_admin').eq('id', user.id).single();
      navRight.innerHTML = buildAuthenticatedActions(user, profile);
      const logoutButton = navRight.querySelector('[data-nav-logout]');
      logoutButton?.addEventListener('click', async () => {
        await window.sb.auth.signOut();
        window.location.reload();
      });
    } catch {
      navRight.innerHTML = buildGuestActions();
    }
  }

  function syncFooterYear(footer) {
    const textEl = footer.querySelector('.footer-text');
    if (!textEl) {
      return;
    }

    const year = new Date().getFullYear();
    textEl.textContent = textEl.textContent.replace(/©\s*\d{4}/, `© ${year}`);
  }

  function hardenExternalLinks(scope = document) {
    scope.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
      const relParts = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
      relParts.add('noopener');
      relParts.add('noreferrer');
      anchor.setAttribute('rel', Array.from(relParts).join(' '));
    });
  }

  function optimizeImages(scope = document) {
    scope.querySelectorAll('img').forEach((img) => {
      if (!img.hasAttribute('decoding')) {
        img.decoding = 'async';
      }

      if (!img.hasAttribute('loading') && !img.closest('.hero, .page-header, .profile-header')) {
        img.loading = 'lazy';
      }
    });
  }

  function renderFooter(footer) {
    const linkKeys = (footer.dataset.footerLinks || '')
      .split(',')
      .map((link) => link.trim())
      .filter(Boolean);

    const linksContainer = footer.querySelector('.footer-links');
    if (!linksContainer || !linkKeys.length) {
      return;
    }

    const justify = footer.dataset.footerJustify || 'center';
    const gap = footer.dataset.footerGap || '20px';

    linksContainer.innerHTML = '';
    linksContainer.style.display = 'flex';
    linksContainer.style.gap = gap;
    linksContainer.style.flexWrap = 'wrap';
    linksContainer.style.justifyContent = justify;
    linksContainer.style.alignItems = 'center';

    for (const key of linkKeys) {
      const link = linkDefinitions[key];
      if (!link) {
        continue;
      }

      const anchor = document.createElement('a');
      anchor.href = link.href;
      anchor.textContent = link.label;
      anchor.style.fontSize = '12px';
      anchor.style.color = link.color;
      anchor.style.textDecoration = 'none';

      if (link.target) {
        anchor.target = link.target;
        anchor.rel = 'noopener noreferrer';
      }

      linksContainer.appendChild(anchor);
    }

    syncFooterYear(footer);
  }

  function initFooters() {
    injectNavigationStyles();
    renderNavigationShell();
    syncNavigationAuth();
    document.querySelectorAll('footer[data-footer-links]').forEach(renderFooter);
    hardenExternalLinks();
    optimizeImages();

    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (!(node instanceof Element)) {
            continue;
          }

          if (node.matches('a[target="_blank"]')) {
            hardenExternalLinks(node.parentElement || document);
          } else if (node.querySelector('a[target="_blank"]')) {
            hardenExternalLinks(node);
          }

          if (node.matches('img') || node.querySelector('img')) {
            optimizeImages(node);
          }
        }
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooters, { once: true });
  } else {
    initFooters();
  }
})();
