import { html } from 'orison';
import header from '../partials/header.js';
import footer from '../partials/footer.js';

export default context => html`
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>${context.root.data.title}</title>
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <script src="/app.js"></script>
    <link rel="stylesheet" type="text/css" href="/app.css">
  </head>
  <body>
    ${header(context.root.data.title)}
    <main>
      ${context.page.html}
    </main>
    ${footer()}
  </body>
</html>
`;
