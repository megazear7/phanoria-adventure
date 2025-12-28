import { html } from 'orison';
import { client } from '../../contentful.js';
import standardNav from '../../partials/standard-nav.js';
import eventPartial from '../../partials/event.js';
import searchBox from '../../partials/search-box.js';
import { orderEvents } from '../../utils/event.js';
import eventPagination from '../../partials/event-pagination.js';
import { makeEventPages } from '../../utils/pagination.js';

function searchParams(slug) {
  var params = {
    'content_type': 'event',
    'fields.hide[ne]': true,
    'order': '-fields.year,-fields.month,-fields.day,-fields.ordering',
    'limit': 50,
  };

  return params;
}

export default async context => {
  const pages = await makeEventPages();
  const events = orderEvents(await client.getEntries(searchParams()));
  const currentPath = '/characters';

  return html`
    <section class="title-section">
      <h1>Timeline</h1>
    </section>
    <section>
      ${eventPagination(context, pages[0], pages)}
    </section>
    <section>
      ${searchBox('Search Events')}
    </section>
    <section>
      ${events.items.map(event => eventPartial(event))}
    </section>
    ${standardNav(currentPath)}
  `;
};
