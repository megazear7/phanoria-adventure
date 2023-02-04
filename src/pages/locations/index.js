import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import locationsPartial from '../../partials/locations.js';

function searchParams(slug) {
  var params = {
    'content_type': 'location'
  };

  return params;
}

export default async context => {
  const locations = await client.getEntries(searchParams());
  const currentPath = '/locations';
  const links = [
    { path: `/`, title: 'Characters' },
    { path: `/timeline`, title: 'Timeline' },
    { path: `/npcs`, title: 'NPCs' },
    { path: `/locations`, title: 'Locations' },
    { path: `/items`, title: 'Items' },
  ];

  return html`
    <section class="title-section">
      <h1>Locations</h1>
    </section>
    <section>
      ${locationsPartial(locations.items)}
    </section>
    ${nav(links, currentPath, false)}
  `;
};