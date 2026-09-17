import './search-box.js';

const IDENTITY_AUDIENCE = 'https://identity.megazear7.com';
const ASK_HISTORY_KEY = 'phanoria:ask-history';
let authClientPromise;

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
    const pathNoExt = path.replace('.html', '')
    if ((hrefNoExt != '/' && pathNoExt === hrefNoExt) || (hrefNoExt === '/' && pathNoExt === '/')) {
      link.classList.add('active');
    }
  });
  document.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightBlock(block);
  });
  fullscreenImgInit();
  initializeAuth();
  initializeAsk();
}

function initializeAuth() {
  const button = document.querySelector('[data-auth-action]');
  if (!button || button.dataset.initialized === 'true') return;
  button.dataset.initialized = 'true';

  button.addEventListener('click', async () => {
    const client = await getAuthClient();
    if (!client) return;

    if (await client.isAuthenticated()) {
      client.logout({ logoutParams: { returnTo: window.location.origin } });
    } else {
      await client.loginWithRedirect();
    }
  });

  getAuthClient().then(async client => {
    if (!client) {
      button.textContent = 'Log in unavailable';
      button.title = 'Auth0 settings are not configured for this deployment.';
      return;
    }

    button.textContent = (await client.isAuthenticated()) ? 'Log out' : 'Log in';
  }).catch(error => {
    console.error('Unable to initialize Megazear identity login.', error);
    button.textContent = 'Log in unavailable';
  });
}

async function getAuthClient() {
  if (authClientPromise) return authClientPromise;

  const config = window.PHANORIA_AUTH_CONFIG;
  const createAuth0Client = window.auth0?.createAuth0Client;
  if (!config?.domain || !config?.clientId || !createAuth0Client) return null;

  authClientPromise = createAuth0Client({
    domain: config.domain,
    clientId: config.clientId,
    authorizationParams: {
      audience: IDENTITY_AUDIENCE,
      redirect_uri: window.location.origin,
    },
  }).then(async client => {
    if (window.location.search.includes('code=') && window.location.search.includes('state=')) {
      await client.handleRedirectCallback();
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    return client;
  });

  return authClientPromise;
}

async function initializeAsk() {
  const form = document.querySelector('[data-ask-form]');
  if (!form || form.dataset.initialized === 'true') return;
  form.dataset.initialized = 'true';

  const status = document.querySelector('[data-ask-status]');
  const history = document.querySelector('[data-ask-history]');
  const button = form.querySelector('button[type="submit"]');
  renderAskHistory(history, readAskHistory());

  form.addEventListener('submit', async event => {
    event.preventDefault();
    const question = form.elements.question.value.trim();
    if (!question) return;

    status.textContent = 'Thinking...';
    button.disabled = true;

    try {
      const client = await getAuthClient();
      if (!client || !(await client.isAuthenticated())) {
        status.textContent = 'Please log in first.';
        return;
      }

      const token = await client.getTokenSilently();
      const response = await fetch('/.netlify/functions/ask', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });
      const answer = await response.json();
      if (!response.ok) throw new Error(answer.message || 'Unable to answer the question.');

      const record = {
        question,
        isYes: answer.confidence >= 0.8,
        createdAt: new Date().toISOString(),
      };
      const records = [record, ...readAskHistory()];
      localStorage.setItem(ASK_HISTORY_KEY, JSON.stringify(records));
      renderAskHistory(history, records);
      form.reset();
      status.textContent = '';
    } catch (error) {
      console.error('Unable to ask Phanoria.', error);
      status.textContent = error.message;
    } finally {
      button.disabled = false;
    }
  });
}

function readAskHistory() {
  try {
    const records = JSON.parse(localStorage.getItem(ASK_HISTORY_KEY) || '[]');
    return Array.isArray(records) ? records : [];
  } catch {
    return [];
  }
}

function renderAskHistory(history, records) {
  history.replaceChildren();
  if (!records.length) {
    const empty = document.createElement('p');
    empty.className = 'ask-empty';
    empty.textContent = 'Your questions will appear here.';
    history.append(empty);
    return;
  }

  records.forEach(record => {
    const card = document.createElement('article');
    card.className = 'ask-card';

    const content = document.createElement('div');
    const question = document.createElement('p');
    question.className = 'ask-card-question';
    question.textContent = record.question;
    const date = document.createElement('p');
    date.className = 'ask-card-meta';
    date.textContent = new Date(record.createdAt).toLocaleString();
    content.append(question, date);

    const answer = document.createElement('span');
    answer.className = `ask-card-answer ${record.isYes ? 'yes' : 'no'}`;
    answer.textContent = record.isYes ? 'Yes' : 'No';
    card.append(content, answer);
    history.append(card);
  });
}

window.addEventListener('popstate', event => {
  event.state && event.state.fragmentHtml
    ? replacePage(event.state.fragmentHtml, event.pathname)
    : loadFragment(document.location.pathname);
});

document.addEventListener("DOMContentLoaded", () => {
  initializeAuth();
  initializeAsk();
  fullscreenImgInit();
  document.body.querySelectorAll('.open-song').forEach(button => {
    button.addEventListener('click', () => {
      const songUrl = button.getAttribute('song-url');
      const iframe = document.body.querySelector('.song-backdrop iframe');
      iframe.src = songUrl;
      document.body.querySelector('.song-backdrop').classList.add('opening');
      setTimeout(() => {
        document.body.querySelector('.song-backdrop').classList.add('visible');
        document.body.querySelector('.song-backdrop').classList.remove('opening');
      }, 350);
    });
  });

  document.body.querySelector('.song-backdrop').addEventListener('click', () => {
    document.body.querySelector('.song-backdrop').classList.add('closing');
    
    const iframe = document.body.querySelector('.song-backdrop iframe');
    setTimeout(() => {
      document.body.querySelector('.song-backdrop').classList.remove('visible');
      document.body.querySelector('.song-backdrop').classList.remove('closing');
      iframe.src = '';
    }, 350);
  });

  document.body.addEventListener('click', event => {
    var tag = event.target;

    // It's a left click on an <a href=...>.
    if (tag.tagName == 'A' && tag.href && event.button == 0) {
      // It's a same-origin navigation: a link within the site.
      if (tag.origin == document.location.origin) {
        var oldPath = document.location.pathname;
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

function fullscreenImgInit() {
  document.querySelectorAll('.search-entry .richtext-img')
  .forEach(img => img.addEventListener('click', () => {
    console.log(img.src);
    const divNode = document.createElement('div');
    divNode.classList = 'fullscreen-img';
    const imgNode = document.createElement('img');
    divNode.appendChild(imgNode);
    imgNode.src = img.src;
    imgNode.addEventListener('click', () => document.querySelectorAll('.fullscreen-img').forEach(nodeToRemove => {
      nodeToRemove.remove();
    }));
    document.body.appendChild(divNode);
  }));
}