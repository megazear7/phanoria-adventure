import { html } from 'orison';
import { renderRichText } from '../contentful.js';

export default items => items ? html`
    ${items.map(item => html`
        <div class="search-entry">
            <h4>${item.fields.title}</h4>
            ${renderRichText(item.fields.description)}
        </div>
    `)}
`: ''
