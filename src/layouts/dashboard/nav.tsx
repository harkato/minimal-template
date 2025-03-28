import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { MiniLogo } from 'src/components/logo/mini-logo';
import { Scrollbar } from 'src/components/scrollbar';

import { NavUpgrade } from '../components/nav-upgrade';
import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';
import { NavItem } from '../config-nav-dashboard';
import { ExpandLess, ExpandMore } from '@mui/icons-material';
import { Collapse } from '@mui/material';
import { set } from 'date-fns';

// ----------------------------------------------------------------------

export type NavContentProps = {
  data: {
    path?: string;
    title: string;
    icon?: React.ReactNode;
    info?: React.ReactNode;
    children?: NavItem[];
  }[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  workspaces: WorkspacesPopoverProps['data'];
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  workspaces,
  isExpanded,
  setIsExpanded,
  layoutQuery,
}: NavContentProps & {
  isExpanded: boolean;
  setIsExpanded: (value: boolean) => void;
  layoutQuery: Breakpoint;
}) {
  const theme = useTheme();
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleToggle = (title: string) => {
    if (!isExpanded) {
      // Se estiver colapsado, expande e abre o submenu
      setIsExpanded(true);
      setOpenMenus((prev) => ({ ...prev, [title]: true }));
    } else {
      // Alterna o submenu quando a sidebar já está expandida
      setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
    }
  };

  const handleCloseMenu = () => {
    setIsExpanded(false);
  };

  return (
    <Box
      sx={{
        pt: 2.5,
        px: isExpanded ? 2.5 : 1,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: isExpanded ? 'var(--layout-nav-vertical-width)' : 72,
        borderRight: `1px solid var(--layout-nav-border-color, ${theme.vars.palette.grey['500Channel']} / 0.12)`,
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        transition: theme.transitions.create('width', {
          duration: theme.transitions.duration.short,
        }),
        ...sx,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: isExpanded ? 'flex-start' : 'center',
          mb: 2,
          transition: theme.transitions.create(['justify-content', 'width'], {
            duration: theme.transitions.duration.short,
          }),
        }}
      >
        {isExpanded ? <Logo /> : <MiniLogo />}
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isChildActive = hasChildren
                ? item.children?.some((child) => child.path === pathname)
                : false;
              const isActive = item.path === pathname || isChildActive;
              const isOpen = openMenus[item.title] ?? false;

              return (
                <Box key={item.title} component="ul">
                  <ListItem disableGutters disablePadding>
                    <ListItemButton
                      disableGutters
                      component={hasChildren ? 'button' : RouterLink}
                      href={!hasChildren ? (item.path ?? '#') : undefined}
                      onClick={hasChildren ? () => handleToggle(item.title) : handleCloseMenu}
                      sx={{
                        justifyContent: 'center',
                        pl: isExpanded ? 2 : 1.5,
                        py: 1,
                        gap: isExpanded ? 2 : 0,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: isExpanded ? 'body2' : 'caption',
                        fontWeight: isActive ? 'fontWeightSemiBold' : 'fontWeightMedium',
                        color: isActive
                          ? 'var(--layout-nav-item-active-color)'
                          : 'var(--layout-nav-item-color)',
                        bgcolor: isActive ? 'var(--layout-nav-item-active-bg)' : 'transparent',
                        '&:hover': {
                          bgcolor: 'var(--layout-nav-item-hover-bg)',
                        },
                        transition: theme.transitions.create('width', {
                          duration: theme.transitions.duration.short,
                        }),
                      }}
                    >
                      <Box
                        component="span"
                        sx={{
                          width: 24,
                          height: 24,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {item.icon}
                      </Box>

                      {isExpanded && (
                        <Box component="span" flexGrow={1}>
                          {item.title}
                        </Box>
                      )}

                      {isExpanded && hasChildren && (
                        <Box component="span">{isOpen ? <ExpandLess /> : <ExpandMore />}</Box>
                      )}
                    </ListItemButton>
                  </ListItem>

                  {/* Submenu */}
                  {hasChildren && isExpanded && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Box component="ul" sx={{ pl: 3 }}>
                        {item.children?.map((child) => {
                          const isChildActive = child.path === pathname;
                          return (
                            <ListItem disableGutters disablePadding key={child.title}>
                              <ListItemButton
                                disableGutters
                                component={RouterLink}
                                href={child.path ?? '#'}
                                onClick={handleCloseMenu}
                                sx={{
                                  pl: isExpanded ? 4 : 3,
                                  pr: 1.5,
                                  py: 1,
                                  typography: 'body2',
                                  fontWeight: isChildActive ? 'fontWeightBold' : 'fontWeightMedium',
                                  color: isChildActive
                                    ? 'var(--layout-nav-item-active-color)'
                                    : 'var(--layout-nav-item-color)',
                                  '&:hover': {
                                    color: 'var(--layout-nav-item-hover-color)',
                                  },
                                  minHeight: 'var(--layout-nav-item-height)',
                                }}
                              >
                                <Box component="span" flexGrow={1}>
                                  {child.title}
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </Box>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </Box>
  );
}

// ----------------------------------------------------------------------

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
  workspaces,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 2.5,
          px: 2.5,
          overflow: 'unset',
          bgcolor: 'var(--layout-nav-bg)',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, sx }: NavContentProps) {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<Record<string, boolean>>({});

  const handleToggle = (title: string) => {
    setOpenMenus((prev) => ({ ...prev, [title]: !prev[title] }));
  };

  return (
    <>
      <Logo sx={{ mb: 2 }} />

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const hasChildren = Array.isArray(item.children) && item.children.length > 0;
              const isChildActive = hasChildren
                ? item.children?.some((child) => child.path === pathname)
                : false;
              const isActive = item.path === pathname || isChildActive;
              const isOpen = openMenus[item.title] ?? false;

              return (
                <Box key={item.title} component="ul">
                  <ListItem disableGutters disablePadding>
                    <ListItemButton
                      disableGutters
                      component={!hasChildren ? RouterLink : 'button'}
                      href={!hasChildren ? (item.path ?? '#') : undefined}
                      onClick={hasChildren ? () => handleToggle(item.title) : undefined}
                      sx={{
                        pl: 2,
                        py: 1,
                        gap: 2,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: 'var(--layout-nav-item-color)',
                        minHeight: 'var(--layout-nav-item-height)',
                        ...(isActive && {
                          fontWeight: 'fontWeightSemiBold',
                          bgcolor: 'var(--layout-nav-item-active-bg)',
                          color: 'var(--layout-nav-item-active-color)',
                          '&:hover': {
                            bgcolor: 'var(--layout-nav-item-hover-bg)',
                          },
                        }),
                      }}
                    >
                      <Box component="span" sx={{ width: 24, height: 24 }}>
                        {item.icon}
                      </Box>

                      <Box component="span" flexGrow={1}>
                        {item.title}
                      </Box>

                      {hasChildren ? isOpen ? <ExpandLess /> : <ExpandMore /> : item.info}
                    </ListItemButton>
                  </ListItem>

                  {/* Submenu */}
                  {hasChildren && (
                    <Collapse in={isOpen} timeout="auto" unmountOnExit>
                      <Box component="ul" sx={{ pl: 4 }}>
                        {item.children?.map((child) => {
                          const isChildActive = child.path === pathname;
                          return (
                            <ListItem disableGutters disablePadding key={child.title}>
                              <ListItemButton
                                disableGutters
                                component={RouterLink}
                                href={child.path ?? '#'}
                                sx={{
                                  pl: 4, // Mantém alinhamento da hierarquia
                                  pr: 1.5,
                                  py: 1,
                                  typography: 'body2',
                                  fontWeight: isChildActive ? 'fontWeightBold' : 'fontWeightMedium', // Apenas negrito no ativo
                                  color: isChildActive
                                    ? 'var(--layout-nav-item-active-color)' // Cor de destaque no ativo
                                    : 'var(--layout-nav-item-color)',
                                  '&:hover': {
                                    color: 'var(--layout-nav-item-hover-color)', // Destaque no hover
                                  },
                                  minHeight: 'var(--layout-nav-item-height)', // Padroniza altura
                                }}
                              >
                                <Box component="span" flexGrow={1}>
                                  {child.title}
                                </Box>
                              </ListItemButton>
                            </ListItem>
                          );
                        })}
                      </Box>
                    </Collapse>
                  )}
                </Box>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}
