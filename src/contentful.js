const contentful = require('contentful');
import { html, unsafeHTML } from 'orison';
import { INLINES, BLOCKS } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';
require('dotenv').config();

let contentfulConfig = {
  space: process.env.SPACE_ID,
  accessToken: process.env.CONTENTFUL_API_TOKEN
}

if (process.env.CONTENTFUL_ENV === 'preview') contentfulConfig.host = 'preview.contentful.com';

export const client = contentful.createClient(contentfulConfig);

export function renderRichText(document) {
  const htmlString = documentToHtmlString(document, {
    renderNode: {
      [INLINES.HYPERLINK]: node => {
        if (node.data.uri.startsWith(process.env.HOST_URI)) {
          return `<a href="${node.data.uri}">${node.content.length > 0 ? node.content[0].value : ''}</a>`;
        } else {
          return `<a href="${node.data.uri}" target="_blank">${node.content.length > 0 ? node.content[0].value : ''}</a>`;
        }
      },
      [BLOCKS.EMBEDDED_ASSET]: node => {
        return `<img class="richtext-img" src="${node.data.target.fields.file.url}"/>`;
      }
    }
  });

  return html`${unsafeHTML(htmlString)}`;
}