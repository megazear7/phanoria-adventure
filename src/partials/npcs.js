import { html } from 'orison';
import { renderRichText } from '../contentful.js';

export default npcs => npcs ? html`
    ${npcs.map(npc => html`
        <h4>${npc.fields.name}</h4>
        ${renderRichText(npc.fields.description)}
    `)}
`: ''
