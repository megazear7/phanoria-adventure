import nav from "./nav.js";

const links = [
{ path: `/`, title: 'Home' },
{ path: `/timeline`, title: 'Timeline' },
{ path: `/story`, title: 'Story' },
{ path: `/npcs`, title: 'NPCs' },
{ path: `/locations`, title: 'Locations' },
{ path: `/ask`, title: 'Ask' },
];

export default function standardNav(currentPath) {
  return nav(links.slice(0, 2), links.slice(2), currentPath, false);
}
