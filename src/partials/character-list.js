import { html } from 'orison';

export default async characters => {
  return html`
    ${characters.map(character => html`
      <h5>
        <a class="item" href="/characters/${character.sys.id}.html">${character.fields.name}</a>
      </h5>
    `)}
  `;
};