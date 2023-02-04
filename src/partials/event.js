import { html } from 'orison';
import datePartial from './date.js';
import { renderRichText } from '../contentful.js';

export default event => event ? html`
    <h4>${event.fields.title}</h4>
    ${datePartial(event.fields.year, event.fields.month, event.fields.day)}
    ${renderRichText(event.fields.description)}
` : '';
