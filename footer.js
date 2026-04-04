(() => {
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
    renders: {
      label: '3D Renders/Wallpapers',
      href: 'renders-wallpapers.html',
      color: '#83d8ff',
      target: '',
    },
    assets: {
      label: 'Game Assets',
      href: 'game-assets.html',
      color: '#83d8ff',
      target: '',
    },
  };

  function renderFooter(footer) {
    const linkKeys = (footer.dataset.footerLinks || '')
      .split(',')
      .map((link) => link.trim())
      .filter(Boolean);

    const autoResourceLinks = ['renders', 'assets'];
    for (const key of autoResourceLinks) {
      if (!linkKeys.includes(key)) {
        linkKeys.push(key);
      }
    }

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
  }

  function initFooters() {
    document.querySelectorAll('footer[data-footer-links]').forEach(renderFooter);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initFooters, { once: true });
  } else {
    initFooters();
  }
})();
