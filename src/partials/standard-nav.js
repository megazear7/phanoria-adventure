import nav from "./nav.js";

const links = [
{ path: `/`, title: 'Home' },
{ path: `/timeline`, title: 'Timeline' },
{ path: `/story`, title: 'Story' },
{ path: `/npcs`, title: 'NPCs' },
{ path: `/locations`, title: 'Locations' },
];

export default function standardNav(currentPath) {
  return nav(links, currentPath, false);
}
