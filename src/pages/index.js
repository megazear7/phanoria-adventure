import { html } from 'orison';
import { client, renderRichText } from '../contentful.js';
import characterList from '../partials/character-list.js';
import nav from '../partials/nav';
import searchBox from '../partials/search-box.js';

export default async context => {
  const contentfulPage = await client.getEntry(context.data.pageId);
  const secondaryPage = await client.getEntry(context.data.secondaryPageId);
  const characters = await client.getEntries({
    'content_type': 'character',
    'order': '-sys.updatedAt'
  })

  const currentPath = '/';
  const links = [
    { path: `/`, title: 'Characters' },
    { path: `/timeline`, title: 'Timeline' },
    { path: `/npcs`, title: 'NPCs' },
    { path: `/locations`, title: 'Locations' },
    { path: `/items`, title: 'Items' },
  ];
  
  return html`
    ${nav(links, currentPath, false)}
    ${renderRichText(contentfulPage.fields.body)}
    <section>
      ${searchBox('Search Characters')}
      ${characterList(characters.items)}
    </section>
    ${renderRichText(secondaryPage.fields.body)}
  `;
}