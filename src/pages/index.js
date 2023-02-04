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
    { path: `/`, title: 'Characters' },
    { path: `/timeline`, title: 'Timeline' },
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
    <section>
      <h4>The Lands of JanCastle</h4>
      <div>
        <a href="/the-lands-of-jancastle.jpg"><img class="map" src="/the-lands-of-jancastle.jpg"></a>
      </div>
    </section>
  `;
}