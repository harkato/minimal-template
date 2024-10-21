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
    icon: icon('ic-analytics'),
  },
  {
    title: 'Reports',
    path: '/user',
    icon: icon('ic-user'),
  },
  {
    title: 'Statistics',
    path: '/products',
    icon: icon('ic-cart'),
    info: (
      <Label color="error" variant="inverted">
        +3
      </Label>
    ),
  },
  {
    title: 'Trace Analysis',
    path: '/blog',
    icon: icon('ic-blog'),
  },
  {
    title: 'Notifications',
    path: '/sign-in',
    icon: icon('ic-lock'),
  },
  {
    title: 'Tool Center',
    path: '/404',
    icon: icon('ic-disabled'),
  },
  {
    title: 'Command Center',
    path: '/',
    icon: icon('ic-analytics'),
  },
  {
    title: 'Administration',
    path: '/user',
    icon: icon('ic-user'),
  },
];
