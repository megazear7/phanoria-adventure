import { html } from 'orison';

export default (links, currentPath, addExtension) => html`
  <nav>
    <div>
      ${links.map(link => html`
        <a href="${link.path}${addExtension ? '.html' : ''}" class="${currentPath === link.path ? 'active' : ''}">${link.title}</a>
      `)}
    </div>
  </nav>
`;
