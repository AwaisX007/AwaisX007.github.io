(() => {
  const navigationLinks = [
    { label: 'Home', href: 'index.html', match: ['index.html', ''] },
    { label: 'Search', href: 'search.html', match: ['search.html'] },
    { label: 'Guides', href: 'guides.html', match: ['guides.html'] },
    { label: 'Blog', href: 'blog.html', match: ['blog.html'] },
    { label: 'Tier Lists', href: 'tierlists.html', match: ['tierlists.html'] },
    { label: 'Pro Settings', href: 'prosettings.html', match: ['prosettings.html'] },
    { label: 'Leaderboard', href: 'leaderboard.html', match: ['leaderboard.html'] },
    { label: 'About Us', href: 'about.html', match: ['about.html'] },
  ];

  const featuredLinks = [
    { label: 'Renders', href: 'renders-wallpapers.html', match: ['renders-wallpapers.html'] },
    { label: 'Game Assets', href: 'game-assets.html', match: ['game-assets.html'] },
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

  // Hotfix bootstrap: use a clean implementation and bypass legacy duplicated blocks below.
  const initV2 = () => {
    const notificationChannels = [];
    let notificationsRefreshTimer = null;

    const escapeHtmlV2 = (value) => String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

    const currentPage = () => (window.location.pathname.split('/').pop() || 'index.html').toLowerCase();
    const isActive = (link) => link.match.includes(currentPage());

    const injectStylesV2 = () => {
      if (document.getElementById('marineo-nav-styles-v2')) return;
      const style = document.createElement('style');
      style.id = 'marineo-nav-styles-v2';
      style.textContent = `
        nav.marineo-nav { position: sticky; top: 0; z-index: 1000; background: rgba(8,8,8,.94); border-bottom: 1px solid rgba(255,255,255,.08); backdrop-filter: blur(14px); }
        .marineo-nav-shell { width:100%; padding:0 28px; min-height:66px; display:grid; grid-template-columns:auto minmax(0,1fr) auto auto; align-items:center; gap:20px; }
        .marineo-nav-brand { display:inline-flex; align-items:center; gap:4px; font-family:'Barlow Condensed',sans-serif; font-size:22px; font-weight:700; letter-spacing:2px; color:#e8c84a; text-decoration:none; white-space:nowrap; }
        .marineo-nav-brand span { color:#fff; }
        .marineo-nav-toggle { display:none; align-items:center; gap:8px; margin-left:auto; padding:8px 12px; border-radius:4px; border:1px solid rgba(42,42,42,.95); background:rgba(255,255,255,.02); color:#e0e0e0; font-size:12px; font-weight:600; cursor:pointer; }
        .marineo-nav-toggle-icon { display:inline-flex; flex-direction:column; gap:3px; }
        .marineo-nav-toggle-icon span { width:14px; height:2px; border-radius:999px; background:currentColor; display:block; }
        .marineo-nav-panel { min-width:0; display:flex; align-items:center; gap:18px; }
        .marineo-nav-links { flex:1; display:flex; align-items:center; gap:18px; justify-content:space-evenly; min-width:0; }
        .marineo-nav-links a { position:relative; font-size:13px; font-weight:500; color:#999; text-decoration:none; white-space:nowrap; }
        .marineo-nav-links a:hover, .marineo-nav-links a.active { color:#e8c84a; }
        .marineo-nav-links a.active::after { content:''; position:absolute; left:0; right:0; bottom:-18px; height:2px; background:#e8c84a; }
        .marineo-nav-featured { display:flex; align-items:center; gap:12px; }
        .marineo-nav-featured a { display:inline-flex; align-items:center; justify-content:center; padding:8px 12px; border-radius:999px; border:1px solid rgba(232,200,74,.24); color:#e8c84a; background:rgba(232,200,74,.05); font-size:12px; font-weight:600; text-decoration:none; }
        .marineo-nav-featured a.active { color:#080808; background:#e8c84a; border-color:#e8c84a; }
        .marineo-nav-actions { display:flex; align-items:center; justify-content:flex-end; gap:10px; }
        .marineo-nav-actions .btn-login, .marineo-nav-actions .btn-logout { font-size:12px; padding:7px 14px; background:transparent; border:1px solid rgba(42,42,42,.95); color:#999; border-radius:4px; text-decoration:none; cursor:pointer; }
        .marineo-nav-actions .btn-signup { font-size:12px; padding:7px 14px; background:#e8c84a; color:#080808; border:none; border-radius:4px; text-decoration:none; font-weight:700; }
        .marineo-nav-actions .nav-profile-link { font-size:12px; color:#e0e0e0; text-decoration:none; max-width:170px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap; }
        .marineo-nav-actions .nav-admin-link { font-size:12px; color:#e8c84a; text-decoration:none; border:1px solid rgba(232,200,74,.25); padding:7px 12px; border-radius:4px; white-space:nowrap; }
        .nav-notify { position: relative; }
        .nav-notify-btn { display:inline-flex; align-items:center; gap:7px; border:1px solid rgba(42,42,42,.95); background:rgba(255,255,255,.02); color:#cfcfcf; border-radius:999px; padding:6px 10px; font-size:12px; cursor:pointer; }
        .nav-notify-badge { display:none; min-width:18px; height:18px; border-radius:999px; background:#e8c84a; color:#080808; align-items:center; justify-content:center; font-size:11px; font-weight:700; padding:0 6px; }
        .nav-notify-badge.show { display:inline-flex; }
        .nav-notify-menu { display:none; position:absolute; top:calc(100% + 10px); right:0; width:330px; max-height:420px; overflow:hidden; border-radius:8px; border:1px solid rgba(255,255,255,.1); background:#111; box-shadow:0 12px 30px rgba(0,0,0,.35); z-index:1001; }
        .nav-notify.open .nav-notify-menu { display:block; }
        .nav-notify-head { display:flex; align-items:center; justify-content:space-between; gap:8px; padding:10px 12px; border-bottom:1px solid rgba(255,255,255,.08); }
        .nav-notify-head strong { font-size:12px; color:#fff; letter-spacing:.5px; }
        .nav-notify-mark { border:1px solid rgba(232,200,74,.3); background:rgba(232,200,74,.08); color:#e8c84a; font-size:11px; border-radius:4px; padding:4px 8px; cursor:pointer; }
        .nav-notify-list { max-height:350px; overflow-y:auto; display:flex; flex-direction:column; }
        .nav-notify-item { text-decoration:none; color:#ddd; border-bottom:1px solid rgba(255,255,255,.06); padding:10px 12px; display:block; }
        .nav-notify-item:hover { background:rgba(255,255,255,.04); }
        .nav-notify-item.unread { background:rgba(232,200,74,.08); }
        .nav-notify-item-title { font-size:12px; color:#f3f3f3; margin-bottom:3px; }
        .nav-notify-item-meta { font-size:11px; color:#9b9b9b; }
        .nav-notify-empty { padding:16px 12px; color:#8a8a8a; font-size:12px; }
        @media (max-width:1024px) {
          .marineo-nav-shell { display:flex; flex-wrap:wrap; padding:10px 16px 12px; }
          .marineo-nav-toggle { display:inline-flex; }
          .marineo-nav-panel { order:4; width:100%; flex-direction:column; align-items:flex-start; gap:12px; padding-top:12px; border-top:1px solid rgba(255,255,255,.06); max-height:0; overflow:hidden; opacity:0; pointer-events:none; transition:max-height .25s ease, opacity .2s ease; }
          nav.marineo-nav.menu-open .marineo-nav-panel { max-height:420px; opacity:1; pointer-events:auto; }
          .marineo-nav-links, .marineo-nav-featured, .marineo-nav-actions { width:100%; justify-content:flex-start; flex-wrap:wrap; }
        }
      `;
      document.head.appendChild(style);
    };

    const buildGuest = () => '<a class="btn-login" href="login.html">Log in</a><a class="btn-signup" href="signup.html">Sign up</a>';
    const buildAuth = (user, profile) => {
      const isAdmin = !!profile?.is_admin;
      const username = escapeHtmlV2(profile?.username || user?.email || 'Profile');
      const profileHref = user?.id ? `profile.html?id=${encodeURIComponent(user.id)}` : 'profile.html';
      return `<a class="nav-profile-link" href="${profileHref}">${username}</a><div class="nav-notify" data-nav-notify-root><button class="nav-notify-btn" type="button" data-nav-notify><span>🔔</span><span class="nav-notify-badge" data-nav-notify-badge>0</span></button><div class="nav-notify-menu" data-nav-notify-menu><div class="nav-notify-head"><strong>Notifications</strong><button type="button" class="nav-notify-mark" data-nav-notify-mark>Mark all read</button></div><div class="nav-notify-list" data-nav-notify-list><div class="nav-notify-empty">Loading…</div></div></div></div><a class="btn-login" href="create.html">Create</a>${isAdmin ? '<a class="nav-admin-link" href="admin.html">Admin</a>' : ''}<button class="btn-logout" type="button" data-nav-logout>Log out</button>`;
    };

    const notificationStorageKey = (userId) => `marineo_seen_notifications_${userId}`;
    const readSeenNotificationKeys = (userId) => {
      try {
        const raw = localStorage.getItem(notificationStorageKey(userId));
        const parsed = raw ? JSON.parse(raw) : [];
        return new Set(Array.isArray(parsed) ? parsed : []);
      } catch {
        return new Set();
      }
    };
    const saveSeenNotificationKeys = (userId, keysSet) => {
      try {
        localStorage.setItem(notificationStorageKey(userId), JSON.stringify(Array.from(keysSet)));
      } catch {}
    };

    const timeAgoV2 = (date) => {
      const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
      if (seconds < 60) return 'just now';
      const mins = Math.floor(seconds / 60);
      if (mins < 60) return `${mins}m ago`;
      const hrs = Math.floor(mins / 60);
      if (hrs < 24) return `${hrs}h ago`;
      const days = Math.floor(hrs / 24);
      if (days < 30) return `${days}d ago`;
      const mos = Math.floor(days / 30);
      if (mos < 12) return `${mos}mo ago`;
      return `${Math.floor(mos / 12)}y ago`;
    };

    const uniqueByKeyV2 = (items) => {
      const seen = new Set();
      return items.filter((item) => {
        if (seen.has(item.key)) return false;
        seen.add(item.key);
        return true;
      });
    };

    const safeSelectRowsV2 = async (builder) => {
      const { data, error } = await builder;
      if (error) return [];
      return Array.isArray(data) ? data : (data ? [data] : []);
    };

    const fetchNotificationItems = async (userId) => {
      const items = [];

      const approvedPosts = await safeSelectRowsV2(
        window.sb
        .from('posts')
        .select('id, title, created_at')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })
        .limit(8)
      );

      approvedPosts.forEach((post) => {
        items.push({
          key: `post-approved-${post.id}`,
          title: `Post approved: ${post.title || 'Untitled'}`,
          href: `post.html?id=${encodeURIComponent(post.id)}`,
          createdAt: post.created_at,
        });
      });

      const postIds = approvedPosts.map((post) => post.id);
      const ownedPostIds = await safeSelectRowsV2(window.sb.from('posts').select('id').eq('user_id', userId).order('created_at', { ascending: false }).limit(20));
      const watchedPostIds = Array.from(new Set([...postIds, ...ownedPostIds.map((post) => post.id)]));

      const comments = watchedPostIds.length
        ? await safeSelectRowsV2(
          window.sb
            .from('post_comments')
            .select('id, post_id, user_id, created_at, profiles(username), posts(id, title, user_id)')
            .in('post_id', watchedPostIds)
            .neq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(15)
        )
        : [];

      comments.forEach((comment) => {
        items.push({
          key: `post-comment-${comment.id}`,
          title: `${comment.profiles?.username || 'Someone'} commented on: ${comment.posts?.title || 'your post'}`,
          href: `post.html?id=${encodeURIComponent(comment.post_id)}`,
          createdAt: comment.created_at,
        });
      });

      const votes = watchedPostIds.length
        ? await safeSelectRowsV2(
          window.sb
            .from('post_upvotes')
            .select('id, post_id, user_id, created_at, profiles(username), posts(id, title, user_id)')
            .in('post_id', watchedPostIds)
            .neq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(15)
        )
        : [];

      votes.forEach((vote) => {
        items.push({
          key: `post-upvote-${vote.id}`,
          title: `${vote.profiles?.username || 'Someone'} upvoted: ${vote.posts?.title || 'your post'}`,
          href: `post.html?id=${encodeURIComponent(vote.post_id)}`,
          createdAt: vote.created_at,
        });
      });

      const renders = await safeSelectRowsV2(
        window.sb
          .from('renders_wallpapers')
          .select('id, title, created_at, status')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)
      );

      renders.filter((render) => render.status === 'approved').forEach((render) => {
        items.push({
          key: `render-approved-${render.id}`,
          title: `Wallpaper approved: ${render.title || 'Untitled'}`,
          href: `render-wallpaper.html?id=${encodeURIComponent(render.id)}`,
          createdAt: render.created_at,
        });
      });

      const renderIds = renders.map((render) => render.id);
      const renderComments = renderIds.length
        ? await safeSelectRowsV2(
          window.sb
            .from('renders_wallpaper_comments')
            .select('id, render_id, user_id, created_at, profiles(username), renders_wallpapers(id, title, user_id)')
            .in('render_id', renderIds)
            .neq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(15)
        )
        : [];

      renderComments.forEach((comment) => {
        items.push({
          key: `render-comment-${comment.id}`,
          title: `${comment.profiles?.username || 'Someone'} commented on: ${comment.renders_wallpapers?.title || 'your wallpaper'}`,
          href: `render-wallpaper.html?id=${encodeURIComponent(comment.render_id)}`,
          createdAt: comment.created_at,
        });
      });

      const renderVotes = renderIds.length
        ? await safeSelectRowsV2(
          window.sb
            .from('renders_wallpaper_upvotes')
            .select('id, render_id, user_id, created_at, profiles(username), renders_wallpapers(id, title, user_id)')
            .in('render_id', renderIds)
            .neq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(15)
        )
        : [];

      renderVotes.forEach((vote) => {
        items.push({
          key: `render-upvote-${vote.id}`,
          title: `${vote.profiles?.username || 'Someone'} upvoted: ${vote.renders_wallpapers?.title || 'your wallpaper'}`,
          href: `render-wallpaper.html?id=${encodeURIComponent(vote.render_id)}`,
          createdAt: vote.created_at,
        });
      });

      const assets = await safeSelectRowsV2(
        window.sb
          .from('game_assets_uploads')
          .select('id, title, created_at')
          .eq('user_id', userId)
          .order('created_at', { ascending: false })
          .limit(20)
      );

      const assetIds = assets.map((asset) => asset.id);
      const assetComments = assetIds.length
        ? await safeSelectRowsV2(
          window.sb
            .from('game_asset_comments')
            .select('id, asset_id, user_id, created_at, profiles(username), game_assets_uploads(id, title, user_id)')
            .in('asset_id', assetIds)
            .neq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(15)
        )
        : [];

      assetComments.forEach((comment) => {
        items.push({
          key: `asset-comment-${comment.id}`,
          title: `${comment.profiles?.username || 'Someone'} commented on: ${comment.game_assets_uploads?.title || 'your asset'}`,
          href: `game-asset.html?id=${encodeURIComponent(comment.asset_id)}`,
          createdAt: comment.created_at,
        });
      });

      const assetVotes = assetIds.length
        ? await safeSelectRowsV2(
          window.sb
            .from('game_asset_upvotes')
            .select('id, asset_id, user_id, created_at, profiles(username), game_assets_uploads(id, title, user_id)')
            .in('asset_id', assetIds)
            .neq('user_id', userId)
            .order('created_at', { ascending: false })
            .limit(15)
        )
        : [];

      assetVotes.forEach((vote) => {
        items.push({
          key: `asset-upvote-${vote.id}`,
          title: `${vote.profiles?.username || 'Someone'} upvoted: ${vote.game_assets_uploads?.title || 'your asset'}`,
          href: `game-asset.html?id=${encodeURIComponent(vote.asset_id)}`,
          createdAt: vote.created_at,
        });
      });

      return uniqueByKeyV2(items)
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 25);
    };

    const wireNotifications = async (userId) => {
      const root = document.querySelector('[data-nav-notify-root]');
      const btn = root?.querySelector('[data-nav-notify]');
      const list = root?.querySelector('[data-nav-notify-list]');
      const badge = root?.querySelector('[data-nav-notify-badge]');
      const markAll = root?.querySelector('[data-nav-notify-mark]');
      if (!root || !btn || !list || !badge || !markAll) return;
      root.dataset.userId = userId;
      const canRealtime = !!window.realtimeUtils?.subscribe;

      const render = async () => {
        const seen = readSeenNotificationKeys(userId);
        const items = await fetchNotificationItems(userId);

        const unreadCount = items.reduce((count, item) => count + (seen.has(item.key) ? 0 : 1), 0);
        badge.textContent = String(unreadCount);
        badge.classList.toggle('show', unreadCount > 0);

        if (!items.length) {
          list.innerHTML = '<div class="nav-notify-empty">No notifications yet.</div>';
          return;
        }

        list.innerHTML = items.map((item) => {
          const unread = !seen.has(item.key);
          return `<a class="nav-notify-item ${unread ? 'unread' : ''}" href="${item.href}" data-notify-key="${escapeHtmlV2(item.key)}"><div class="nav-notify-item-title">${escapeHtmlV2(item.title)}</div><div class="nav-notify-item-meta">${timeAgoV2(item.createdAt)}</div></a>`;
        }).join('');

        list.querySelectorAll('[data-notify-key]').forEach((anchor) => {
          anchor.addEventListener('click', () => {
            const key = anchor.getAttribute('data-notify-key');
            const currentSeen = readSeenNotificationKeys(userId);
            currentSeen.add(key);
            saveSeenNotificationKeys(userId, currentSeen);
          });
        });
      };

      const scheduleRefresh = () => {
        if (notificationsRefreshTimer) clearTimeout(notificationsRefreshTimer);
        notificationsRefreshTimer = setTimeout(() => {
          render();
        }, 250);
      };

      if (!markAll.dataset.bound) {
        markAll.dataset.bound = '1';
        markAll.addEventListener('click', async () => {
          const currentUserId = root.dataset.userId;
          if (!currentUserId) return;
          const items = await fetchNotificationItems(currentUserId);
          saveSeenNotificationKeys(currentUserId, new Set(items.map((item) => item.key)));
          render();
        });
      }

      if (!btn.dataset.bound) {
        btn.dataset.bound = '1';
        btn.addEventListener('click', (event) => {
          event.stopPropagation();
          root.classList.toggle('open');
        });
      }

      if (!root.dataset.boundOutside) {
        root.dataset.boundOutside = '1';
        document.addEventListener('click', (event) => {
          if (!root.contains(event.target)) {
            root.classList.remove('open');
          }
        });
      }

      notificationChannels.splice(0).forEach((channel) => window.realtimeUtils?.unsubscribe?.(channel));
      if (canRealtime) {
        notificationChannels.push(
          window.realtimeUtils.subscribe({ table: 'posts', onChange: scheduleRefresh, channelName: `rt_nav_posts_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'post_comments', onChange: scheduleRefresh, channelName: `rt_nav_comments_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'post_upvotes', onChange: scheduleRefresh, channelName: `rt_nav_votes_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'renders_wallpapers', onChange: scheduleRefresh, channelName: `rt_nav_renders_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'renders_wallpaper_comments', onChange: scheduleRefresh, channelName: `rt_nav_render_comments_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'renders_wallpaper_upvotes', onChange: scheduleRefresh, channelName: `rt_nav_render_votes_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'game_asset_comments', onChange: scheduleRefresh, channelName: `rt_nav_asset_comments_${userId}` }),
          window.realtimeUtils.subscribe({ table: 'game_asset_upvotes', onChange: scheduleRefresh, channelName: `rt_nav_asset_votes_${userId}` })
        );
      }

      await render();
    };

    const renderNavV2 = () => {
      document.querySelectorAll('nav').forEach((nav) => {
        nav.classList.add('marineo-nav');
        nav.innerHTML = `
          <div class="marineo-nav-shell">
            <a class="marineo-nav-brand" href="index.html">MARINEO<span>FPS</span></a>
            <button class="marineo-nav-toggle" type="button" aria-expanded="false" aria-controls="marineo-nav-panel"><span class="marineo-nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span><span>Menu</span></button>
            <div class="marineo-nav-panel" id="marineo-nav-panel">
              <div class="marineo-nav-links">${navigationLinks.map((link) => `<a href="${link.href}"${isActive(link) ? ' class="active"' : ''}>${link.label}</a>`).join('')}</div>
              <div class="marineo-nav-featured">${featuredLinks.map((link) => `<a href="${link.href}"${isActive(link) ? ' class="active"' : ''}>${link.label}</a>`).join('')}</div>
              <div class="marineo-nav-actions" id="nav-right">${buildGuest()}</div>
            </div>
          </div>
        `;
      });
    };

    const setupToggleV2 = () => {
      const nav = document.querySelector('nav.marineo-nav');
      const toggle = nav?.querySelector('.marineo-nav-toggle');
      if (!nav || !toggle) return;
      const closeMenu = () => { nav.classList.remove('menu-open'); toggle.setAttribute('aria-expanded', 'false'); };
      toggle.addEventListener('click', () => {
        const isOpen = nav.classList.toggle('menu-open');
        toggle.setAttribute('aria-expanded', String(isOpen));
      });
      nav.querySelectorAll('.marineo-nav-panel a, .marineo-nav-panel button').forEach((el) => {
        el.addEventListener('click', () => { if (window.matchMedia('(max-width: 1024px)').matches) closeMenu(); });
      });
    };

    const renderAuthV2 = async () => {
      const navRight = document.getElementById('nav-right');
      if (!navRight || !window.authUtils?.getCurrentUser) return;
      try {
        const user = await window.authUtils.getCurrentUser();
        if (!user) {
          notificationChannels.splice(0).forEach((channel) => window.realtimeUtils?.unsubscribe?.(channel));
          navRight.innerHTML = buildGuest();
          return;
        }
        const profile = await window.authUtils.getProfile(user.id, 'username, is_admin');
        navRight.innerHTML = buildAuth(user, profile);
        wireNotifications(user.id);
        navRight.querySelector('[data-nav-logout]')?.addEventListener('click', async () => {
          notificationChannels.splice(0).forEach((channel) => window.realtimeUtils?.unsubscribe?.(channel));
          await window.sb.auth.signOut();
          window.location.reload();
        });
      } catch {
        notificationChannels.splice(0).forEach((channel) => window.realtimeUtils?.unsubscribe?.(channel));
        navRight.innerHTML = buildGuest();
      }
    };

    const syncYearV2 = (footer) => {
      const textEl = footer.querySelector('.footer-text');
      if (!textEl) return;
      textEl.textContent = textEl.textContent.replace(/©\s*\d{4}/, `© ${new Date().getFullYear()}`);
    };

    const renderFooterV2 = (footer) => {
      const linkKeys = (footer.dataset.footerLinks || '').split(',').map((link) => link.trim()).filter(Boolean);
      const linksContainer = footer.querySelector('.footer-links');
      if (!linksContainer || !linkKeys.length) return;
      linksContainer.innerHTML = '';
      linksContainer.style.display = 'flex';
      linksContainer.style.gap = footer.dataset.footerGap || '20px';
      linksContainer.style.flexWrap = 'wrap';
      linksContainer.style.justifyContent = footer.dataset.footerJustify || 'center';
      linksContainer.style.alignItems = 'center';
      for (const key of linkKeys) {
        const link = linkDefinitions[key];
        if (!link) continue;
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
      syncYearV2(footer);
    };

    const hardenExternal = (scope = document) => {
      scope.querySelectorAll('a[target="_blank"]').forEach((anchor) => {
        const relParts = new Set((anchor.getAttribute('rel') || '').split(/\s+/).filter(Boolean));
        relParts.add('noopener');
        relParts.add('noreferrer');
        anchor.setAttribute('rel', Array.from(relParts).join(' '));
      });
    };

    const optimizeImagesV2 = (scope = document) => {
      scope.querySelectorAll('img').forEach((img) => {
        if (!img.hasAttribute('decoding')) img.decoding = 'async';
        if (!img.hasAttribute('loading') && !img.closest('.hero, .page-header, .profile-header')) img.loading = 'lazy';
      });
    };

    const startV2 = () => {
      injectStylesV2();
      renderNavV2();
      setupToggleV2();
      renderAuthV2();
      if (window.authUtils?.onAuthStateChange) {
        window.authUtils.onAuthStateChange(() => {
          renderAuthV2();
        });
      }
      document.querySelectorAll('footer[data-footer-links]').forEach(renderFooterV2);
      hardenExternal();
      optimizeImagesV2();
    };

    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', startV2, { once: true });
    } else {
      startV2();
    }
  };

  initV2();
  return;

  /* legacy footer/nav block disabled

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
        width: 100%;
        max-width: none;
        margin: 0 auto;
        padding: 0 28px;
        min-height: 66px;
        display: grid;
        grid-template-columns: auto minmax(0, 1fr) auto auto;
        align-items: center;
        gap: 20px;
      }

      .marineo-nav-toggle {
        display: none;
        align-items: center;
        gap: 8px;
        margin-left: auto;
        padding: 8px 12px;
        border-radius: 4px;
        border: 1px solid rgba(42, 42, 42, 0.95);
        background: rgba(255, 255, 255, 0.02);
        color: #e0e0e0;
        font-size: 12px;
        font-weight: 600;
        cursor: pointer;
        transition: border-color 0.2s ease, color 0.2s ease, background 0.2s ease;
      }

      .marineo-nav-toggle:hover,
      .marineo-nav-toggle:focus-visible {
        color: #fff;
        border-color: rgba(232, 200, 74, 0.35);
        background: rgba(232, 200, 74, 0.06);
        outline: none;
      }

      .marineo-nav-toggle-icon {
        display: inline-flex;
        flex-direction: column;
        gap: 3px;
      }

      .marineo-nav-toggle-icon span {
        width: 14px;
        height: 2px;
        border-radius: 999px;
        background: currentColor;
        display: block;
      }

      .marineo-nav-panel {
        min-width: 0;
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
        flex-wrap: nowrap;
        justify-content: space-evenly;
        min-width: 0;
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

      .marineo-nav-featured a.active {
        color: #080808;
        background: #e8c84a;
        border-color: #e8c84a;
      }

      .marineo-nav-featured a.active:hover {
        transform: none;
      }

      .marineo-nav-featured {
        display: flex;
        align-items: center;
        gap: 12px;
        flex-shrink: 0;
      }

      .marineo-nav-featured a {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(232, 200, 74, 0.24);
        color: #e8c84a;
        background: rgba(232, 200, 74, 0.05);
        font-size: 12px;
        font-weight: 600;
        text-decoration: none;
        white-space: nowrap;
        transition: background 0.2s ease, border-color 0.2s ease, transform 0.2s ease;
      }

      .marineo-nav-featured a:hover {
        background: rgba(232, 200, 74, 0.12);
        border-color: rgba(232, 200, 74, 0.4);
        transform: translateY(-1px);
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
          display: flex;
          flex-wrap: wrap;
          padding: 10px 16px 12px;
        }

        .marineo-nav-toggle {
          display: inline-flex;
        }

        .marineo-nav-panel {
          order: 4;
          width: 100%;
          flex-direction: column;
          align-items: flex-start;
          gap: 12px;
          padding-top: 12px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          max-height: 0;
          overflow: hidden;
          opacity: 0;
          pointer-events: none;
          transition: max-height 0.25s ease, opacity 0.2s ease, padding 0.2s ease;
        }

        nav.marineo-nav.menu-open .marineo-nav-panel {
          max-height: 420px;
          opacity: 1;
          pointer-events: auto;
        }

        .marineo-nav-links {
          width: 100%;
          justify-content: flex-start;
          gap: 12px 16px;
        }

        .marineo-nav-featured {
          width: 100%;
          justify-content: flex-start;
          flex-wrap: wrap;
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

        .marineo-nav-featured {
          gap: 8px;
        }

        .marineo-nav-featured a {
          padding: 7px 10px;
          font-size: 11px;
        }

        .marineo-nav-toggle {
          width: 100%;
          justify-content: center;
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
          <button class="marineo-nav-toggle" type="button" aria-expanded="false" aria-controls="marineo-nav-panel">
            <span class="marineo-nav-toggle-icon" aria-hidden="true"><span></span><span></span><span></span></span>
            <span>Menu</span>
          </button>
          <div class="marineo-nav-panel" id="marineo-nav-panel">
            <div class="marineo-nav-links">
              ${navigationLinks.map(link => `<a href="${link.href}"${isActiveLink(link) ? ' class="active"' : ''}>${link.label}</a>`).join('')}
            </div>
            <div class="marineo-nav-featured">
              ${featuredLinks.map(link => `<a href="${link.href}"${isActiveLink(link) ? ' class="active"' : ''}>${link.label}</a>`).join('')}
            </div>
            <div class="marineo-nav-actions" id="nav-right">
              ${buildGuestActions()}
            </div>
          </div>
        </div>
      `;
    });

      function setupNavigationToggle() {
        const nav = document.querySelector('nav.marineo-nav');
        const toggle = nav?.querySelector('.marineo-nav-toggle');
        const panel = nav?.querySelector('.marineo-nav-panel');

        if (!nav || !toggle || !panel) {
          return;
        }

        const closeMenu = () => {
          nav.classList.remove('menu-open');
          toggle.setAttribute('aria-expanded', 'false');
        };

        toggle.addEventListener('click', () => {
          const isOpen = nav.classList.toggle('menu-open');
          toggle.setAttribute('aria-expanded', String(isOpen));
        });

        panel.querySelectorAll('a, button').forEach((element) => {
          element.addEventListener('click', () => {
            if (window.matchMedia('(max-width: 1024px)').matches) {
              closeMenu();
            }
          });
        });

        window.addEventListener('resize', () => {
          if (!window.matchMedia('(max-width: 1024px)').matches) {
            closeMenu();
          }
        });
      }
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

  }
      if (!img.hasAttribute('loading') && !img.closest('.hero, .page-header, .profile-header')) {
  function setupNavigationToggle() {
    const nav = document.querySelector('nav.marineo-nav');
    const toggle = nav?.querySelector('.marineo-nav-toggle');
    const panel = nav?.querySelector('.marineo-nav-panel');

    if (!nav || !toggle || !panel) {
      return;
    }
      .map((link) => link.trim())
    const closeMenu = () => {
      nav.classList.remove('menu-open');
      toggle.setAttribute('aria-expanded', 'false');
    };
      return;
    toggle.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('menu-open');
      toggle.setAttribute('aria-expanded', String(isOpen));
    });

    panel.querySelectorAll('a, button').forEach((element) => {
      element.addEventListener('click', () => {
        if (window.matchMedia('(max-width: 1024px)').matches) {
          closeMenu();
        }
      });
    });

    window.addEventListener('resize', () => {
      if (!window.matchMedia('(max-width: 1024px)').matches) {
        closeMenu();
      }
    });
  }

  async function getActiveUser() {
    const { data: { session } } = await window.sb.auth.getSession();
    if (session?.user) {
      return session.user;
    }

    const { data: { user } } = await window.sb.auth.getUser();
    return user || null;
  }

  async function renderNavigationAuth() {
    const navRight = document.getElementById('nav-right');
    if (!navRight || !window.sb?.auth?.getSession) {
      return;
    }

    try {
      const user = await getActiveUser();
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

  function syncNavigationAuth() {
    if (!window.sb?.auth?.onAuthStateChange) {
      return;
    }

    renderNavigationAuth();

    window.sb.auth.onAuthStateChange(() => {
      renderNavigationAuth();
    });
  }

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
  */
})();
