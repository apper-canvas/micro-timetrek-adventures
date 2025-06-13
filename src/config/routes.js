import Home from '@/components/pages/Home';
import Location from '@/components/pages/Location';
import Journal from '@/components/pages/Journal';
import Settings from '@/components/pages/Settings';

export const routes = {
  home: {
    id: 'home',
    label: 'Time Machine',
    path: '/home',
    icon: 'Clock',
    component: Home
  },
  location: {
    id: 'location',
    label: 'Location',
    path: '/location/:id',
    icon: 'Map',
    component: Location
  },
  journal: {
    id: 'journal',
    label: 'Journal',
    path: '/journal',
    icon: 'BookOpen',
    component: Journal
  },
  settings: {
    id: 'settings',
    label: 'Settings',
    path: '/settings',
    icon: 'Settings',
    component: Settings
  }
};

export const routeArray = Object.values(routes);
export default routes;