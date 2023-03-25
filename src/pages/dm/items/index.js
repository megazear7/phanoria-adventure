import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';

export default async context => {
  const items = await client.getEntries({
    'content_type': 'item',
    'order': '-sys.updatedAt'
  });

  const links = [
    { path: `/dm`, title: 'Characters' },
    { path: `/dm/timeline`, title: 'Timeline' },
    { path: `/dm/npcs`, title: 'NPCs' },
    { path: `/dm/locations`, title: 'Locations' },
    { path: `/dm/items`, title: 'Items' },
  ];

  const currentPath = `${context.path}`;

  return html`
    ${nav(links, currentPath)}
    <section>
      ${items.items.map(item => html`
        <h4>${item.fields.id} - ${item.fields.title}</h4>
        ${renderRichText(item.fields.description)}
        ${item.fields.dmNotes ? html`
          <h5>DM Notes</h5>
          ${renderRichText(item.fields.dmNotes)}
        ` : ''}
      `)}
    </section>
  `;
};