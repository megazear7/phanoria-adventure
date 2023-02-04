import { html } from 'orison';
import { renderRichText } from '../contentful.js';

export default items => items ? html`
    ${items.map(item => html`
        <h4>${item.fields.title}</h4>
        ${renderRichText(item.fields.description)}
    `)}
`: ''
