import { html } from 'orison';
import { client, renderRichText } from '../../contentful.js';
import datePartial from '../../partials/date.js';

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
    return {
      name: character.sys.id,
      html: html`
        <section>
          <h1>${character.fields.name}</h1>
          ${eventsByCharacter[character.sys.id].map(event => html`
            <h3>${event.fields.title}</h3>
            ${datePartial(event.fields.year, event.fields.month, event.fields.day)}
            ${renderRichText(event.fields.description)}
            <br>
          `)}
        </section>
      `
    }
  });
};