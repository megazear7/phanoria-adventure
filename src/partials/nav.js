import { html } from 'orison';

export default (links, moreLinks, currentPath, addExtension) => {
  if (!Array.isArray(moreLinks)) {
    addExtension = currentPath;
    currentPath = moreLinks;
    moreLinks = [];
  }

  return html`
  <nav>
    <div>
      ${links.map(link => html`
        <a href="${link.path}${addExtension ? '.html' : ''}" class="${currentPath === link.path ? 'active' : ''}">${link.title}</a>
      `)}
      <div class="more-nav">
        <button type="button" class="more-nav-toggle" data-more-toggle aria-expanded="false">More</button>
        <div class="more-nav-menu" data-more-menu>
          ${moreLinks.map(link => html`
            <a href="${link.path}${addExtension ? '.html' : ''}" class="${currentPath === link.path ? 'active' : ''}">${link.title}</a>
          `)}
          <button type="button" class="auth-action" data-auth-action>Log in</button>
        </div>
      </div>
    </div>
  </nav>
`;
};
