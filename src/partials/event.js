import { html } from 'orison';
import datePartial from './date.js';
import { renderRichText } from '../contentful.js';

export default event => {
    if (!event) return '';

    const chars = event.fields.involvement;

    const singleCharHtml = chars && chars.length === 1 ? html`
        <p><i>What follows is told from the perspective of ${chars[0].fields.name}</i></p>
    ` : '';

    return html`
        <div class="search-entry">
            <h4>${event.fields.title}</h4>
            ${datePartial(event.fields.year, event.fields.month, event.fields.day)}
            ${singleCharHtml}
            ${renderRichText(event.fields.description)}
        </div>
    `;
};
