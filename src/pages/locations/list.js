import { html } from 'orison';
import { client, renderRichText } from '../../contentful.js';
import datePartial from '../../partials/date.js';
import nav from '../../partials/nav.js';

function searchParams(slug) {
  var params = {
    'content_type': 'character'
  };

  if (slug) params['sys.id'] = slug;

  return params;
}

export default async (context, slug) => {
  const characters = await client.getEntries(searchParams(slug));

  return characters.items.map(character => {
    const links = [
      { path: `/characters/${character.sys.id}`, title: 'Timeline' },
      { path: `/npcs/${character.sys.id}`, title: 'NPCs' },
      { path: `/locations/${character.sys.id}`, title: 'Locations' },
      { path: `/items/${character.sys.id}`, title: 'Items' },
    ];

    const currentPath = `${context.path}/${character.sys.id}`;

    return {
      name: character.sys.id,
      html: html`
        <section class="title-section">
          <h1>${character.fields.name}</h1>
        </section>
        ${nav(links, currentPath, true)}
        <section>
          ${character.fields.locations ? html`
            ${character.fields.locations.map(location => html`
              <h4>${location.fields.title}</h4>
              ${renderRichText(location.fields.description)}
            `)}
          `: ''}
        </section>
      `
    }
  });
};