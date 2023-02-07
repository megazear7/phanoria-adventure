import { html } from 'orison';
import { renderRichText } from '../contentful.js';

export default npcs => npcs ? html`
    ${npcs.map(npc => html`
        <div class="search-entry">
            <h4>${npc.fields.name}</h4>
            ${renderRichText(npc.fields.description)}
        </div>
    `)}
`: ''
