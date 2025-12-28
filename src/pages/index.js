import { html } from 'orison';
import { client, renderRichText } from '../contentful.js';
import characterList from '../partials/character-list.js';
import standardNav from '../partials/standard-nav.js';
import searchBox from '../partials/search-box.js';
import header from '../partials/header.js';

export default async context => {
  const contentfulPage = await client.getEntry(context.data.pageId);
  const secondaryPage = await client.getEntry(context.data.secondaryPageId);
  const characters = await client.getEntries({
    'content_type': 'character',
    'order': '-sys.updatedAt'
  })

  const currentPath = '/';
  
  return html`
    ${header(context.root.data.title)}
    ${standardNav(currentPath)}
    ${renderRichText(contentfulPage.fields.body)}
    <section>
      ${searchBox('Search Characters')}
      ${characterList(characters.items)}
    </section>
    ${renderRichText(secondaryPage.fields.body)}
  `;
}