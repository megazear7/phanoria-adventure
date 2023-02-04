import { html } from 'orison';

export default async characters => {
  return html`
    ${characters.map(character => html`
      <div class="character-from-list">
        <h5>
          <a class="item" href="/characters/${character.sys.id}.html">${character.fields.name}</a>
        </h5>
        <p>Level ${character.fields.level} ${character.fields.race} ${character.fields.class}</p>
        <p>${character.fields.player.fields.name}</p>
      </div>
    `)}
  `;
};