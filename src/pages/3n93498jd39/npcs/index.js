import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';

export default async context => {
  const npcs = await client.getEntries({ 'content_type': 'npc' });

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
      ${npcs.items.map(npc => html`
        <h4>${npc.fields.name}</h4>
        ${renderRichText(npc.fields.description)}
        ${npc.fields.dmNotes ? html`
          <h6>DM Notes</h6>
          ${renderRichText(npc.fields.dmNotes)}
        ` : ''}
      `)}
    </section>
  `;
};