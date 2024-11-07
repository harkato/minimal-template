import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import { styled, useTheme, CSSObject } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { varAlpha } from 'src/theme/styles';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import { WorkspacesPopover } from '../components/workspaces-popover';

import type { WorkspacesPopoverProps } from '../components/workspaces-popover';

// ----------------------------------------------------------------------
const drawerWidth = 300;

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

export type NavContentProps = {
  data: {
    path: string;
    title: string;
    icon: React.ReactNode;
    info?: React.ReactNode;
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
  open,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const theme = useTheme();

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
      variant="permanent"
      sx={{
        pt: 2.5,
        px: 2.5,
        top: 0,
        left: 0,
        height: 1,
        display: 'flex',
        position: 'fixed',
        flexDirection: 'column',
        bgcolor: 'var(--layout-nav-bg)',
        zIndex: 'var(--layout-nav-zIndex)',
        width: open ? '240px' : `calc(${theme.spacing(7)} + 1px)`, // aplica largura condicional
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: open
            ? theme.transitions.duration.enteringScreen
            : theme.transitions.duration.leavingScreen,
        }),
        '& .MuiDrawer-paper': {
          width: open ? '240px' : `calc(${theme.spacing(7)} + 1px)`, // largura da área interna do drawer
          overflowX: 'hidden',
          transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: open
              ? theme.transitions.duration.enteringScreen
              : theme.transitions.duration.leavingScreen,
          }),
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} open={open} workspaces={workspaces} />
    </Drawer>
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
      <NavContent data={data} slots={slots} open={open} workspaces={workspaces} />
    </Drawer>
  );
}

// ----------------------------------------------------------------------

export function NavContent({ data, slots, workspaces, open, sx }: NavContentProps & { open: boolean }) {
  const pathname = usePathname();

  return (
    <>
      { open && <Logo />}

      {slots?.topArea}

      { open && <WorkspacesPopover data={workspaces} sx={{ my: 2 }} />}

      <Scrollbar fillContent>
        <Box component="nav" display="flex" flex="1 1 auto" flexDirection="column" sx={sx}>
          <Box component="ul" gap={0.5} display="flex" flexDirection="column">
            {data.map((item) => {
              const isActived = item.path === pathname;

              return (
                <ListItem disableGutters disablePadding key={item.title}>
                  <ListItemButton
                    disableGutters
                    component={RouterLink}
                    href={item.path}
                    sx={[
                      {
                        pl: 2,
                        py: 1,
                        gap: 2,
                        pr: 1.5,
                        borderRadius: 0.75,
                        typography: 'body2',
                        fontWeight: 'fontWeightMedium',
                        color: 'var(--layout-nav-item-color)',
                        minHeight: 'var(--layout-nav-item-height)',
                      },
                      open
                        ? {
                            mr: 3,
                          }
                        : {
                            mr: 'auto',
                          },
                      {
                        ...(isActived && {
                          fontWeight: 'fontWeightSemiBold',
                          bgcolor: 'var(--layout-nav-item-active-bg)',
                          color: 'var(--layout-nav-item-active-color)',
                          '&:hover': {
                            bgcolor: 'var(--layout-nav-item-hover-bg)',
                          },
                        }),
                      },
                    ]}
                  >
                    <Box component="span" sx={{ width: 24, height: 24 }}>
                      {item.icon}
                    </Box>

                    <Box
                      component="span"
                      flexGrow={1}
                      sx={[
                        open
                          ? {
                              opacity: 1,
                            }
                          : {
                              opacity: 0,
                            },
                      ]}
                    >
                      {item.title}
                    </Box>

                    {item.info && item.info}
                  </ListItemButton>
                </ListItem>
              );
            })}
          </Box>
        </Box>
      </Scrollbar>

      {slots?.bottomArea}

      {/* <NavUpgrade /> */}
    </>
  );
}
