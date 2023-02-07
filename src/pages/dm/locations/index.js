import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';

export default async context => {
  const locations = await client.getEntries({
    'content_type': 'location',
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
      ${locations.items.map(location => html`
        <h4>${location.fields.title}</h4>
        ${renderRichText(location.fields.description)}
        ${location.fields.dmNotes ? html`
          <h6>DM Notes</h6>
          ${renderRichText(location.fields.dmNotes)}
        ` : ''}
      `)}
    </section>
  `;
};