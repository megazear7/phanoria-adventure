import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import itemsPartial from '../../partials/items.js';
import searchBox from '../../partials/search-box.js';

function searchParams(slug) {
  var params = {
    'content_type': 'item',
    'fields.hide[ne]': true,
    'order': '-sys.updatedAt'
  };

  return params;
}

export default async context => {
  const items = await client.getEntries(searchParams());
  const currentPath = '/items';
  const links = [
    { path: `/`, title: 'Characters' },
    { path: `/timeline`, title: 'Timeline' },
    { path: `/npcs`, title: 'NPCs' },
    { path: `/locations`, title: 'Locations' },
    { path: `/items`, title: 'Items' },
  ];

  return html`
    <section class="title-section">
      <h1>Items</h1>
    </section>
    <section>
      ${searchBox('Search Items')}
    </section>
    <section>
      ${itemsPartial(items.items)}
    </section>
    ${nav(links, currentPath, false)}
  `;
};
