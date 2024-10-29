import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = [
  {
    title: 'Dashboard',
    path: '/',
    icon: icon('ic-dashboard'),
  },
  {
    title: 'Reports',
    path: '/user',
    icon: icon('ic-reports'),
  },
  {
    title: 'Statistics',
    path: '/products',
    icon: icon('ic-statistics'),
    info: (
      <Label color="primary">
        +3
      </Label>
    ),
  },
  {
    title: 'Trace Analysis',
    path: '/blog',
    icon: icon('ic-trace'),
  },
  {
    title: 'Notifications',
    path: '/sign-in',
    icon: icon('ic-notifications'),
  },
  {
    title: 'Tool Center',
    path: '/404',
    icon: icon('ic-tool'),
  },
  {
    title: 'Command Center',
    path: '/command',
    icon: icon('ic-command'),
  },
  {
    title: 'Administration',
    path: '/admin',
    icon: icon('ic-admin'),
  },
];
