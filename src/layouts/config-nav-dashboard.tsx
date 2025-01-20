import { Label } from 'src/components/label';
import { SvgColor } from 'src/components/svg-color';
import { useTranslation } from 'react-i18next';
// ----------------------------------------------------------------------

// Define uma interface NavItem para descrever a estrutura de cada item de navegação
interface NavItem {
  title: string;
  path: string;
  icon: React.ReactNode;
  info?: React.ReactNode;
}

const icon = (name: string) => (
  <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

// Deixa explícito o tipo de retorno da função ConfigNavDashboard como { navData: NavItem[] }. 
// Isso indica que a função retorna um objeto com uma única propriedade, navData, que é um array de objetos NavItem.
export const ConfigNavDashboard = (): { navData: NavItem[] } => {
  const { t } = useTranslation();

  // Declara a variável navData com o tipo NavItem[] para garantir que ela contenha apenas objetos que correspondam à interface definida.
  const navData: NavItem[] = [
  {
    title: t('navigation.dashboard'),
    path: '/',
    icon: icon('ic-dashboard'),
  },
  {
    title: t('navigation.reports'),
    path: '/menu',
    // path: '/results',
    icon: icon('ic-reports'),
  },
  // {
  //   title: t('navigation.statistics'),
  //   path: '/products',
  //   icon: icon('ic-statistics'),
  //   info: (
  //     <Label color="primary">
  //       +3
  //     </Label>
  //   ),
  // },
  // {
  //   title: t('navigation.traceAnalysis'),
  //   path: '/blog',
  //   icon: icon('ic-trace'),
  // },
  // {
  //   title: t('navigation.notifications'),
  //   path: '/sign-in',
  //   icon: icon('ic-notifications'),
  // },
  // {
  //   title:  t('navigation.toolCenter'),
  //   path: '/404',
  //   icon: icon('ic-tool'),
  // },
  // {
  //   title: t('navigation.commandCenter'),
  //   path: '/command',
  //   icon: icon('ic-command'),
  // },
  // {
  //   title: t('navigation.administration'),
  //   path: '/admin',
  //   icon: icon('ic-admin'),
  // },
];
return { navData };
}