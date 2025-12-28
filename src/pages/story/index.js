import { html } from 'orison';
import { client } from '../../contentful.js';
import standardNav from '../../partials/standard-nav.js';
import { soundIcon } from '../../partials/icon.sound.js';

export default async context => {
  const campaigns = await client.getEntries({
    'content_type': 'campaign',
    'order': '-fields.order'
  });
  const adventures = await client.getEntries({
    'content_type': 'adventure',
    'order': '-fields.order'
  });
  const currentPath = '/story';

  return html`
    <section class="title-section">
      <h2>Campaigns</h2>
    </section>
    <section>
      ${campaigns.items.map(campaign => html`
        <div class="card">
          <div class="card-content">
            <h3>
              <a href="/campaign/${campaign.sys.id}">${campaign.fields.title}</a>
            </h3>
          </div>
          ${campaign.fields.albumUrl ? html`<a class="sound-icon" href="${campaign.fields.albumUrl}">${soundIcon}</a>` : ''}
          ${ campaign.fields.heroImage ? html`
            <a href="/campaign/${campaign.sys.id}">
              <img class="card-hero" src="${campaign.fields.heroImage.fields.file.url}" alt="${campaign.fields.heroImage.fields.title}" />
            </a>
          `: ''}
        </div>
      `)}
    </section>
    <section class="title-section">
      <h2>Adventures</h2>
    </section>
    <section>
      ${adventures.items.map(adventure => html`
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
    ${standardNav(currentPath)}
  `;
};
