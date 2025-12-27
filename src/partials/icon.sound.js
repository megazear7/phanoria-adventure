import { html } from 'orison';

export const soundIcon = html`
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" role="img" aria-labelledby="listenTitle">
  <title id="listenTitle">Listen</title>

  <!-- speaker body -->
  <polygon
    points="3 8 8 8 13 4 13 20 8 16 3 16"
    fill="none"
    stroke="currentColor"
    stroke-width="1.5"
    stroke-linejoin="round"
    stroke-linecap="round"
  />

  <!-- sound waves -->
  <path d="M16.5 8.5c1.2 1.2 1.9 2.8 1.9 4.5s-.7 3.3-1.9 4.5" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
  <path d="M18.8 6.2c1.9 1.9 3 4.6 3 7.8s-1.1 5.9-3 7.8" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" />

  <!-- inner speaker accent -->
  <path d="M10 9.5v5" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" />
</svg>
`;
