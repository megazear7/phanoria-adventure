import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';

export default async context => {
  const locations = await client.getEntries({ 'content_type': 'location' });

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