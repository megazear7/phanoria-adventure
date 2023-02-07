import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';

export default async context => {
  const items = await client.getEntries({
    'content_type': 'item',
    'order': '-sys.updatedAt'
  });

  const links = [
    { path: `/3n93498jd39`, title: 'Characters' },
    { path: `/3n93498jd39/timeline`, title: 'Timeline' },
    { path: `/3n93498jd39/npcs`, title: 'NPCs' },
    { path: `/3n93498jd39/locations`, title: 'Locations' },
    { path: `/3n93498jd39/items`, title: 'Items' },
  ];

  const currentPath = `${context.path}`;

  return html`
    ${nav(links, currentPath)}
    <section>
      ${items.items.map(item => html`
        <h4>${item.fields.id} - ${item.fields.title}</h4>
        ${renderRichText(item.fields.description)}
        ${item.fields.dmNotes ? html`
          <h6>DM Notes</h6>
          ${renderRichText(item.fields.dmNotes)}
        ` : ''}
      `)}
    </section>
  `;
};