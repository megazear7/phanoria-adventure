import { html } from 'orison';

export default placeholder => {
    return html`
        <div>
            <dnd-search-box placeholder="${placeholder}"></dnd-search-box>
        </div>
    `;
};
