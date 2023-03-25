import { html } from 'orison';

export default async characters => {
  return html`
    ${characters.map(character => html`
      <div class="character-from-list search-entry">
        <h4>${character.fields.name}${status(character)}</h4>
        <div>Level ${character.fields.level} ${character.fields.race} ${character.fields.class}</div>
        <div>${character.fields.player.fields.name}</div>
      </div>
    `)}
  `;
};

function status(character) {
  return character.fields.status != 'Alive' ? html`
    <small>(${character.fields.status})</small>
  ` : '';
}
