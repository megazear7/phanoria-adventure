import { html } from 'orison';

export default async characters => {
  return html`
    ${characters.map(character => html`
      <section>
        <h2>
            <a href="/characters/${character.fields.slug}.html">${character.fields.name}</a>
        </h2>
      </section>
    `)}
  `;
};