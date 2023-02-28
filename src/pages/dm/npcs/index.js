import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';

export default async context => {
  const npcs = await client.getEntries({
    'content_type': 'npc',
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
      ${npcs.items.map(npc => html`
        <h4>${npc.fields.name}</h4>
        ${renderRichText(npc.fields.description)}
        ${npc.fields.dmNotes ? html`
          <h5>DM Notes</h5>
          ${renderRichText(npc.fields.dmNotes)}
        ` : ''}
      `)}
    </section>
  `;
};