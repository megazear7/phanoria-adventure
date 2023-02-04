import { html } from 'orison';
import { client, renderRichText } from '../contentful.js';
import characterList from '../partials/character-list.js';
import nav from '../partials/nav';

export default async context => {
  const contentfulPage = await client.getEntry(context.data.pageId);
  const characters = await client.getEntries({
    'content_type': 'character'
  })

  const currentPath = '/';
  const links = [
    { path: `/characters`, title: 'Timeline' },
    { path: `/npcs`, title: 'NPCs' },
    { path: `/locations`, title: 'Locations' },
    { path: `/items`, title: 'Items' },
  ];
  
  return html`
    ${nav(links, currentPath, false)}
    <section>
      ${renderRichText(contentfulPage.fields.body)}
    </section>
    <section>
      ${characterList(characters.items)}
    </section>
  `;
}