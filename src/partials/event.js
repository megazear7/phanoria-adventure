import { html } from 'orison';
import datePartial from './date.js';
import { renderRichText } from '../contentful.js';
import { soundIcon } from './icon.sound.js';

export default event => {
    if (!event) return '';

    return html`
        <div class="search-entry">
            <h4>${event.fields.title}${event.fields.songUrl ? html`
                <button class="sound-icon open-song" song-url="${event.fields.songUrl}">${soundIcon}</button>
            ` : ''}</h4>
            ${datePartial(event.fields.year, event.fields.month, event.fields.day)}
            ${renderRichText(event.fields.description)}
        </div>
    `;
};
