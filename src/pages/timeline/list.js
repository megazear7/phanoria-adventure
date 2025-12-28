import { html } from 'orison';
import eventPartial from '../../partials/event.js';
import standardNav from '../../partials/standard-nav.js';
import searchBox from '../../partials/search-box.js';
import datePartial from '../../partials/date.js';
import eventPagination from '../../partials/event-pagination.js';
import { makeEventPages } from '../../utils/pagination.js';

export default async (context, slug) => {
  const pages = await makeEventPages();

  return pages.map((page) => {
    const events = page.events;
    const currentPath = `${context.path}/page-${page.page}`;
    const name = `page-${page.page}`;
    const firstEvent = events.items[events.items.length - 1];
    const lastEvent = events.items[0];
    const earliestDate = datePartial(firstEvent.fields.year, firstEvent.fields.month, firstEvent.fields.day);
    const latestDate = datePartial(lastEvent.fields.year, lastEvent.fields.month, lastEvent.fields.day);
    return {
      name: name,
      html: html`
        <section class="title-section timeline-page-title">
          <h1>Timeline</h1>
          <h6>From ${earliestDate} to ${latestDate}</h6>
        </section>
        <section>
          ${eventPagination(context, page, pages)}
        </section>
        <section>
          ${searchBox('Search Events')}
        </section>
        <section>
          ${events.items.map(event => eventPartial(event))}
        </section>
        ${standardNav(currentPath)}
      `
    };
  });
};