import { html } from 'orison';
import { client } from '../../contentful.js';

function searchParams(slug) {
  var params = {
    'content_type': 'character'
  };

  if (slug) params['fields.slug'] = slug;

  return params;
}

export default async (context, slug) => {
  const entries = await client.getEntries(searchParams(slug));

  return entries.items.map(entry => ({
    name: entry.fields.slug,
    html: html`
      <section>
        <h1>${entry.fields.name}</h1>
        <p>TODO: Load in events associated to this character.</p>
      </section>
    `
  }));
};