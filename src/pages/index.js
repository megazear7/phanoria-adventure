import { html } from 'orison';
import { client, renderRichText } from '../contentful.js';
import characterList from '../partials/character-list.js';

export default async context => {
  const contentfulPage = await client.getEntry(context.data.pageId);
  const entries = await client.getEntries({
    'content_type': 'character'
  })
  
  return html`
    <section>
      ${renderRichText(contentfulPage.fields.body)}
    </section>
  `;
}