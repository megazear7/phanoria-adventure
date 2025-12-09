import { html } from 'orison';
import datePartial from './date.js';
import { renderRichText } from '../contentful.js';

const soundIcon = html`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="listenTitle">
  <title id="listenTitle">Listen</title>

  <!-- speaker body -->
  <polygon
    points="3 8 8 8 13 4 13 20 8 16 3 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linejoin="round"
    stroke-linecap="round"
  />

  <!-- sound waves -->
  <path d="M16.5 8.5c1.2 1.2 1.9 2.8 1.9 4.5s-.7 3.3-1.9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M18.8 6.2c1.9 1.9 3 4.6 3 7.8s-1.1 5.9-3 7.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />

  <!-- inner speaker accent -->
  <path d="M10 9.5v5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
</svg>
`;

export default event => {
    if (!event) return '';

    const chars = event.fields.involvement;

    const singleCharHtml = chars && chars.length === 1 ? html`
        <p><i>What follows is told from the perspective of ${chars[0].fields.name}</i></p>
    ` : '';

    return html`
        <div class="search-entry">
            <h4>${event.fields.title}${event.fields.songUrl ? html`
                <button class="open-song" song-url="${event.fields.songUrl}">${soundIcon}</button>
            ` : ''}</h4>
            ${datePartial(event.fields.year, event.fields.month, event.fields.day)}
            ${singleCharHtml}
            ${renderRichText(event.fields.description)}
        </div>
    `;
};
