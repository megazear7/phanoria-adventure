import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import npcsPartial from '../../partials/npcs.js';
import searchBox from '../../partials/search-box.js';

function searchParams(slug) {
  var params = {
    'content_type': 'npc',
    'fields.hide[ne]': true
  };

  return params;
}

export default async context => {
  const npcs = await client.getEntries(searchParams());
  const currentPath = '/npcs';
  const links = [
    { path: `/`, title: 'Characters' },
    { path: `/timeline`, title: 'Timeline' },
    { path: `/npcs`, title: 'NPCs' },
    { path: `/locations`, title: 'Locations' },
    { path: `/items`, title: 'Items' },
  ];

  return html`
    <section class="title-section">
      <h1>NPCs</h1>
    </section>
    <section>
      ${searchBox('Search NPCs')}
    </section>
    <section>
      ${npcsPartial(npcs.items)}
    </section>
    ${nav(links, currentPath, false)}
  `;
};
