import './search-box.js';

const REVEAL_THRESHOLD = 0.16;
const REVEAL_ROOT_MARGIN = '0px 0px -50px 0px';
const MAX_PARALLAX_SHIFT = 18;
const PARALLAX_FACTOR = -0.03;

if ('serviceWorker' in navigator && location.hostname !== 'localhost') {
  navigator.serviceWorker.register('/sw.js')
  .then(function(reg) {
    console.debug('Registration succeeded. Scope is ' + reg.scope);
  }).catch(function(error) {
    console.debug('Registration failed with ' + error);
  });
}

function loadFragment(path, callback) {
  // Determine the fragment path
  var fragmentPath = path.includes('.html')
  ? path.replace('.html', '.fragment.html')
  : path === '/'
    ? '/index.fragment.html'
    : path + '/index.fragment.html';

  fetch(fragmentPath)
  .then(res => {
    if (res.status === 404) {
      window.location.href = path;
      throw new Error('Page not found, trying full load.');
    }
    return res;
  })
  .then(res => res.text())
  .then(fragmentHtml => {
    replacePage(fragmentHtml, path);
    if (typeof callback === 'function') callback(fragmentHtml);
  });
}

function replacePage(fragmentHtml, path) {
  document.querySelector('main').innerHTML = fragmentHtml;
  document.querySelectorAll('nav a').forEach(link => link.classList.remove('active'));
  document.querySelectorAll('nav a').forEach(link => {
    const hrefNoExt = link.getAttribute('href').replace('.html', '');
    const pathNoExt = path.replace('.html', '');
    if ((hrefNoExt != '/' && pathNoExt === hrefNoExt) || (hrefNoExt === '/' && pathNoExt === '/')) {
      link.classList.add('active');
    }
  });
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  initializeInteractiveContent();
}

window.addEventListener('popstate', event => {
  event.state && event.state.fragmentHtml
    ? replacePage(event.state.fragmentHtml, event.pathname)
    : loadFragment(document.location.pathname);
});

document.addEventListener('DOMContentLoaded', () => {
  initializeInteractiveContent();

  const songBackdrop = document.body.querySelector('.song-backdrop');
  if (songBackdrop && !songBackdrop.dataset.bound) {
    songBackdrop.dataset.bound = 'true';
    songBackdrop.addEventListener('click', () => {
      songBackdrop.classList.add('closing');

      const iframe = songBackdrop.querySelector('iframe');
      setTimeout(() => {
        songBackdrop.classList.remove('visible');
        songBackdrop.classList.remove('closing');
        iframe.src = '';
      }, 350);
    });
  }

  document.body.addEventListener('click', event => {
    var tag = event.target;

    // It's a left click on an <a href=...>.
    if (tag.tagName == 'A' && tag.href && event.button == 0) {
      // It's a same-origin navigation: a link within the site.
      if (tag.origin == document.location.origin) {
        var newPath = tag.pathname;

        // Only do this for relative urls
        if (newPath.startsWith('/')) {
          // Prevent the browser from doing the navigation.
          event.preventDefault();

          loadFragment(newPath, fragmentHtml => history.pushState({ fragmentHtml }, '', newPath));
        }
      }
    }
  });
});

function initializeInteractiveContent() {
  fullscreenImgInit();
  bindSongButtons();
  initScrollReveal();
  initParallaxHero();
}

function bindSongButtons() {
  document.body.querySelectorAll('.open-song').forEach(button => {
    if (button.dataset.bound) {
      return;
    }

    button.dataset.bound = 'true';
    button.addEventListener('click', event => {
      event.preventDefault();
      event.stopPropagation();
      const songUrl = button.getAttribute('song-url');
      const backdrop = document.body.querySelector('.song-backdrop');
      const iframe = backdrop.querySelector('iframe');

      iframe.src = songUrl;
      backdrop.classList.add('opening');
      setTimeout(() => {
        backdrop.classList.add('visible');
        backdrop.classList.remove('opening');
      }, 350);
    });
  });
}

function initScrollReveal() {
  const revealTargets = document.querySelectorAll('.search-entry, .card, .title-section, .rich-text > p, .rich-text > h2, .rich-text > h3, .page-hero, .pagination-links');
  if (!revealTargets.length) return;

  revealTargets.forEach(node => node.classList.add('reveal-on-scroll'));

  if (!('IntersectionObserver' in window)) {
    revealTargets.forEach(node => node.classList.add('is-visible'));
    return;
  }

  if (window.__entryRevealObserver) {
    window.__entryRevealObserver.disconnect();
  }

  window.__entryRevealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        window.__entryRevealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: REVEAL_THRESHOLD,
    rootMargin: REVEAL_ROOT_MARGIN,
  });

  revealTargets.forEach(node => window.__entryRevealObserver.observe(node));
}

function initParallaxHero() {
  const heroImages = document.querySelectorAll('.page-hero img');
  if (!heroImages.length) return;

  let ticking = false;

  const updateParallax = () => {
    const viewportHeight = window.innerHeight || 1;
    heroImages.forEach(image => {
      const rect = image.getBoundingClientRect();
      const centeredOffset = ((rect.top + rect.height / 2) - (viewportHeight / 2));
      const translate = Math.max(-MAX_PARALLAX_SHIFT, Math.min(MAX_PARALLAX_SHIFT, centeredOffset * PARALLAX_FACTOR));
      image.style.setProperty('--hero-shift', `${translate.toFixed(2)}px`);
    });
    ticking = false;
  };

  if (window.__heroParallaxHandler) {
    window.removeEventListener('scroll', window.__heroParallaxHandler);
  }

  window.__heroParallaxHandler = () => {
    if (!ticking) {
      window.requestAnimationFrame(updateParallax);
      ticking = true;
    }
  };

  window.addEventListener('scroll', window.__heroParallaxHandler, { passive: true });
  updateParallax();
}

function fullscreenImgInit() {
  document.querySelectorAll('.search-entry .richtext-img')
  .forEach(img => {
    if (img.dataset.bound) {
      return;
    }

    img.dataset.bound = 'true';
    img.addEventListener('click', () => {
      const divNode = document.createElement('div');
      divNode.classList = 'fullscreen-img';
      const imgNode = document.createElement('img');
      divNode.appendChild(imgNode);
      imgNode.src = img.src;
      imgNode.alt = img.alt || 'Fullscreen image';
      imgNode.addEventListener('click', () => document.querySelectorAll('.fullscreen-img').forEach(nodeToRemove => {
        nodeToRemove.remove();
      }));
      document.body.appendChild(divNode);
    });
  });
}
