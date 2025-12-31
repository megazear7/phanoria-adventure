import { orderEvents } from './event.js';
import { client } from '../contentful.js';

const basicRequest = {
  'content_type': 'event',
  'fields.hide[ne]': true,
  'order': '-fields.year,-fields.month,-fields.day,-fields.ordering',
  'limit': 0,
};

export async function makeEventPages() {
  const events = await client.getEntries(basicRequest);
  const total = events.total;
  const limit = 50;
  const numPages = Math.ceil(total / limit);
  const pages = [];
  for (let i = 0; i < numPages; i++) {
    const pageEvents = orderEvents((await client.getEntries({
      ...basicRequest,
      limit: limit,
      skip: i * limit,
    })).items);
    pages.push({
      page: i + 1,
      events: pageEvents,
    });
  }
  return pages;
};
