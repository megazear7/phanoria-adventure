import { html } from 'orison';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';
import header from '../partials/header.js';
import footer from '../partials/footer.js';
import 'dotenv/config';

const authConfig = JSON.stringify({
  domain: process.env.AUTH0_DOMAIN || process.env.VITE_AUTH0_DOMAIN || '',
  clientId: process.env.AUTH0_CLIENT_ID || process.env.VITE_AUTH0_CLIENT_ID || '',
}).replace(/</g, '\\u003c');

export default context => html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${context.root.data.title}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <script type="module" src="/app.js"></script>
    <link rel="stylesheet" type="text/css" href="/app.css">
    <meta name="description" content="${context.root.data.description}">
    <link rel="icon" href="/icons/favicon.ico">
    <link rel="manifest" href="/manifest.json">
    <meta name="theme-color" content="${context.root.data.primaryColor}">
    <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="${context.root.data.title}">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="default">
    <meta name="apple-mobile-web-app-title" content="${context.root.data.title}">

    <!-- Homescreen icons -->
    <link rel="apple-touch-icon" href="/icons/icon-256x256.png">
    <link rel="apple-touch-icon" sizes="512x512" href="/icons/icon-512x512.png">

    <!-- Tile icon for Windows 8 (144x144 + tile color) -->
    <meta name="msapplication-TileImage" content="/icons/icon-512x512.png">
    <meta name="msapplication-TileColor" content="${context.root.data.primaryColor}">
    <meta name="msapplication-tap-highlight" content="no">
    ${unsafeHTML(`<script>window.PHANORIA_AUTH_CONFIG = ${authConfig};</script>`)}
    <script src="https://cdn.auth0.com/js/auth0-spa-js/2.1/auth0-spa-js.production.js"></script>

    <!-- Default twitter cards -->
    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@username">
    <meta property="og:type" content="website">
    <meta property="og:title" content="${context.root.data.shortTitle}">
    <meta property="og:site_name" content="${context.root.data.shortTitle}">
    <meta property="og:description" content="${context.root.data.description}">
    <meta property="og:image" content="/icons/icon-512x512.png" />
  </head>
  <body>
    <main>
      ${context.page.html}
    </main>
    ${footer()}

    <div class="song-backdrop">
      <div class="song-content">
        <iframe src="" width="760" height="240"></iframe>
      </div>
    </div>
  </body>
</html>
`;
