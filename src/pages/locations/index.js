import { html } from 'orison';
import { client } from '../../contentful.js';
import standardNav from '../../partials/standard-nav.js';
import locationsPartial from '../../partials/locations.js';
import searchBox from '../../partials/search-box.js';

function searchParams(slug) {
  var params = {
    'content_type': 'location',
    'fields.hide[ne]': true,
    'order': '-sys.updatedAt'
  };

  return params;
}

export default async context => {
  const locations = await client.getEntries(searchParams());
  const currentPath = '/locations';

  return html`
    <section class="title-section">
      <h1>Locations</h1>
    </section>
    <section>
      ${searchBox('Search Locations')}
    </section>
    <section>
      ${locationsPartial(locations.items)}
    </section>
    ${standardNav(currentPath)}
  `;
};