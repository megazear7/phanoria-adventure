import { html } from 'orison';
import { client } from '../../contentful.js';
import eventPartial from '../../partials/event.js';
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
  const eventsByCharacter = {};

  for (const character of characters.items) {
    try {
      const events = await client.getEntries({
        'content_type': 'event',
        'order': '-fields.year,-fields.month,-fields.day,-fields.ordering'
      });
      eventsByCharacter[character.sys.id] = [];
      for (const event of events.items) {
        if (event.fields.involvement) {
          if (event.fields.involvement.map(inv => inv.sys.id).includes(character.sys.id)) {
            eventsByCharacter[character.sys.id].push(event);
          }
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

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
        <section>
          ${eventsByCharacter[character.sys.id].map(event => eventPartial(event))}
        </section>
        ${nav(links, currentPath, false)}
      `
    }
  });
};