import { html } from 'orison';

export default async characters => {
  return html`
    ${characters.map(character => html`
      <div class="character-from-list">
        <h4>
          <a class="item" href="/timeline/${character.sys.id}.html">${character.fields.name}</a>
        </h4>
        <div>Level ${character.fields.level} ${character.fields.race} ${character.fields.class}</div>
        <div>${character.fields.player.fields.name}</div>
      </div>
    `)}
  `;
};