import { html } from 'orison';

export default (context, page, pages) => html`
    <div class="pagination-links">
    <a href="${context.path}/page-${page.page - 1}.html" class="${page.page > 1 ? '' : 'disabled'}">&lt;</a>
    ${pages.map(innerPage => html`
        <a href="${context.path}/page-${innerPage.page}.html" class="${innerPage.page === page.page ? 'active' : ''}">${innerPage.page}</a>
    `)}
    <a href="${context.path}/page-${page.page + 1}.html" class="${page.page < pages.length ? '' : 'disabled'}">&gt;</a>
    </div>
`;
