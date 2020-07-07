import { html } from 'orison';
import { client, renderRichText } from '../contentful.js';

export default async context => {
  const contentfulPage = await client.getEntry(context.data.pageId);
  
  return html`
    <section>
      ${renderRichText(contentfulPage.fields.body)}
    </section>
  `;
}