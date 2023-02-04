import { html } from 'orison';
import { renderRichText } from '../contentful.js';

export default locations => locations ? html`
    ${locations.map(location => html`
        <h4>${location.fields.title}</h4>
        ${renderRichText(location.fields.description)}
    `)}
`: ''
