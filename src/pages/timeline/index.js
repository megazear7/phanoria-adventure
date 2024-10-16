import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import eventPartial from '../../partials/event.js';
import searchBox from '../../partials/search-box.js';

function searchParams(slug) {
  var params = {
    'content_type': 'event',
    'fields.hide[ne]': true,
    'order': '-fields.year,-fields.month,-fields.day,-fields.ordering'
  };

  return params;
}

export default async context => {
  const events = await client.getEntries(searchParams());
  events.items.sort((aItem, bItem) => {
    const a = aItem.fields;
    const b = bItem.fields;
    const months = [
      '1: January',
      '2: February',
      '3: March',
      '4: April',
      '5: May',
      '6: June',
      '7: July',
      '8: August',
      '9: September',
      '10: October',
      '11: November',
      '12: December',
    ];
    if (b.year != a.year) {
      return b.year - a.year;
    } else if (b.month != a.month) {
      return months.indexOf(b.month) - months.indexOf(a.month);
    } else if (b.day != a.day) {
      return b.day - a.day;
    }
    return a.ordering - b.ordering;
  });
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
