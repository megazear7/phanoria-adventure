import { html } from 'orison';
import { client } from '../../contentful.js';
import nav from '../../partials/nav.js';
import npcsPartial from '../../partials/npcs.js';

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
        ${nav(links, currentPath, false)}
        <section>
          ${npcsPartial(character.fields.npcs)}
        </section>
      `
    }
  });
};