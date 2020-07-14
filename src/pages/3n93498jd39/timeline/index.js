import { html } from 'orison';
import { client, renderRichText } from '../../../contentful.js';
import nav from '../../../partials/nav.js';
import datePartial from '../../../partials/date.js';

export default async context => {
  const events = await client.getEntries({
    'content_type': 'event',
    'order': '-fields.year,-fields.month,-fields.day,-fields.ordering'
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
      ${events.items.map(event => html`
        <h4>
          ${event.fields.title}${event.fields.involvement && event.fields.involvement.length === 1 ? html`
            <small>(${event.fields.involvement[0].fields.name})</small>`
          : ''}
        </h4>
        ${datePartial(event.fields.year, event.fields.month, event.fields.day)}
        ${renderRichText(event.fields.description)}
        ${event.fields.dmNotes ? html`
          <h6>DM Notes</h6>
          ${renderRichText(event.fields.dmNotes)}
        ` : ''}
      `)}
    </section>
  `;
};