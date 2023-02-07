import { html } from 'orison';
import { client } from '../../contentful.js';
import characterList from '../../partials/character-list.js';
import nav from '../../partials/nav.js';
import searchBox from '../../../partials/search-box.js';

/*
This is intentionally placed at a 'hidden' url.
*/

export default async context => {
  const entries = await client.getEntries({
    'content_type': 'character',
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
      ${searchBox('Search Characters')}
    </section>
    <section>
      ${characterList(entries.items)}
    </section>
  `;
};