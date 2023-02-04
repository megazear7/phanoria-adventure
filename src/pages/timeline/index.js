import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import eventPartial from '../../partials/event.js';

function searchParams(slug) {
  var params = {
    'content_type': 'event'
  };

  return params;
}

export default async context => {
  const npcs = await client.getEntries(searchParams());
  const currentPath = '/characters';
  const links = [
    { path: `/`, title: 'Characters' },
    { path: `/timeline`, title: 'Timeline' },
    { path: `/npcs`, title: 'NPCs' },
    { path: `/locations`, title: 'Locations' },
    { path: `/items`, title: 'Items' },
  ];

  return html`
    <section class="title-section">
      <h1>Timeline</h1>
    </section>
    <section>
      ${npcs.items.map(event => eventPartial(event))}}
    </section>
    ${nav(links, currentPath, false)}
  `;
};
