

class SearchBox extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.placeholder = this.getAttribute('placeholder');
        this.shadowRoot.innerHTML = `
            <style>
              .search-box input {
                box-sizing: border-box;
                width: 100%;
                padding: 10px;
                font-size: 1rem;
                border: none;
                background: none;
                text-align: center;
                color: var(--primary-color);
                border-bottom: 1px solid var(--primary-color);
                transition: all 300ms;
              }
              
              .search-box input:focus {
                outline: none;
                border-bottom: 1px solid var(--secondary-color);
              }
            </style>
            <div class="search-box">
                <input placeholder="${this.placeholder}">
            </div>
        `;
        this.shadowRoot.querySelector('input').addEventListener('input', () => {
            const search = this.shadowRoot.querySelector('input').value;
            if (search.length > 2) {
                window.document.querySelectorAll('.search-entry').forEach(element => {
                    if (element.innerText.toLowerCase().includes(search.toLowerCase())) {
                        element.style.display = 'block';
                    } else {
                        element.style.display = 'none';
                    }
                });
            } else {
                window.document.querySelectorAll('.search-entry').forEach(element => {
                    element.style.display = 'block';
                });
            }
        });
    }
}

window.customElements.define('dnd-search-box', SearchBox);
