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
  };

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
