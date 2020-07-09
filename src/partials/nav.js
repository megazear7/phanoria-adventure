import { html } from 'orison';

export default (links, currentPath) => html`
  <nav>
    <div>
      ${links.map(link => html`
        <a href="${link.path}.html" class="${currentPath.startsWith(link.path) ? 'active' : ''}">${link.title}</a>
      `)}
    </div>
  </nav>
`;
