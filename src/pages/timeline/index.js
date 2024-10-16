import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import eventPartial from '../../partials/event.js';
import searchBox from '../../partials/search-box.js';
import { orderEvents } from '../../utils/event.js';

function searchParams(slug) {
  var params = {
    'content_type': 'event',
    'fields.hide[ne]': true,
    'order': '-fields.year,-fields.month,-fields.day,-fields.ordering'
  };

  return params;
}

export default async context => {
  const events = orderEvents(await client.getEntries(searchParams()));
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
      ${searchBox('Search Events')}
    </section>
    <section>
      ${events.items.map(event => eventPartial(event))}
    </section>
    ${nav(links, currentPath, false)}
  `;
};
