import { html } from 'orison';
import { client } from '../../contentful.js';
import eventPartial from '../../partials/event.js';
import standardNav from '../../partials/standard-nav.js';
import searchBox from '../../partials/search-box.js';

export default async (context, slug) => {
  const adventures = await client.getEntries({
    'content_type': 'adventure',
    'order': '-fields.order'
  });

  return adventures.items.map(adventure => {
    const currentPath = `/adventure/${adventure.sys.id}`;

    return {
      name: adventure.sys.id,
      html: html`
        <section class="page-hero">
          <h2><span>${adventure.fields.title}</span></h2>
          <img class="card-hero" src="${adventure.fields.heroImage.fields.file.url}" alt="${adventure.fields.heroImage.fields.title}" />
        </section>
        <section class="shift-section">
          ${searchBox('Search Events')}
        </section>
        <section class="shift-section">
          ${adventure.fields.events && adventure.fields.events.map(event => eventPartial(event))}
        </section>
        ${standardNav(currentPath)}
      `
    }
  });
};