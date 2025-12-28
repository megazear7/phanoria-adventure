import { html } from 'orison';
import { client } from '../../contentful.js';
import eventPartial from '../../partials/event.js';
import nav from '../../partials/nav.js';

export default async (context, slug) => {
  const campaigns = await client.getEntries({
    'content_type': 'campaign',
    'order': '-fields.order'
  });

  return campaigns.items.map(campaign => {
    const currentPath = `/campaign/${campaign.sys.id}`;
    const links = [
      { path: `/`, title: 'Characters' },
      { path: `/story`, title: 'Story' },
      { path: `/npcs`, title: 'NPCs' },
      { path: `/locations`, title: 'Locations' },
      { path: `/items`, title: 'Items' },
    ];

    return {
      name: campaign.sys.id,
      html: html`
        <section class="campaign-hero">
          <h2><span>${campaign.fields.title}</span></h2>
          <img class="card-hero" src="${campaign.fields.heroImage.fields.file.url}" alt="${campaign.fields.heroImage.fields.title}" />
        </section>
        <section class="shift-section">
          ${campaign.fields.adventures.map(adventure => html`
            <div class="card">
              <div class="card-content">
                <h3>
                  <a href="/adventure/${adventure.sys.id}">${adventure.fields.title}</a>
                </h3>
              </div>
              ${adventure.fields.albumUrl ? html`<a class="sound-icon" href="${adventure.fields.albumUrl}">${soundIcon}</a>` : ''}
              ${ adventure.fields.heroImage ? html`
                <a href="/adventure/${adventure.sys.id}">
                  <img class="card-hero" src="${adventure.fields.heroImage.fields.file.url}" alt="${adventure.fields.heroImage.fields.title}" />
                </a>
              `: ''}
            </div>
          `)}
        </section>
        ${nav(links, currentPath, false)}
      `
    }
  });
};