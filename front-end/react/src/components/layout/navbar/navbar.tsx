import React, { useEffect, useState } from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import { Link } from 'react-router-dom';
import { Box, Divider, Menu, MenuItem } from '@material-ui/core';
import { useAuth } from '../../../hooks/useAuth';
import * as api from '../../../api';
import { IUser } from '../../../api';
import Cookies from 'js-cookie';
import NightsStayIcon from '@material-ui/icons/NightsStay';
import WbSunnyIcon from '@material-ui/icons/WbSunny';
import { getDarkModePreference, toggleDarkMode } from '../../../session';
import AccountCircle from '@material-ui/icons/AccountCircle';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    toolbar: {
      height: '65px',
      display: 'flex',
      justifyContent: 'space-between',
    },
    navTitle: {
      color: theme.palette.common.white,
      fontSize: '32px',
      fontWeight: 300,
      letterSpacing: '2px',
      textDecoration: 'none',
      [theme.breakpoints.down('sm')]: {
        fontSize: '24px',
      },
    },
    navLink: {
      color: theme.palette.common.white,
      fontSize: '20px',
      fontWeight: 500,
      textDecoration: 'none',
      [theme.breakpoints.down('sm')]: {
        fontSize: '18px',
        fontWeight: 400,
      },
    },
    divider: {
      height: '24px',
      width: '2px',
      marginLeft: '10px',
      marginRight: '10px',
      background: theme.palette.common.white,
    },
    navIcon: {
      fontSize: '32px',
    },
  })
);

export const NavBar = () => {
  const classes = useStyles();
  const darkMode = getDarkModePreference();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  useEffect(() => {
    const awaitAuthentication = async () => {
      const { user, isAuthenticated } = await useAuth();

      setUser(user);
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    };

    awaitAuthentication();
  }, []);

  const handleLogout = async () => {
    if (user?.sessionToken) {
      await api.signOut({ sessionToken: user?.sessionToken });
      Cookies.remove('session');
      window.location.reload();
    }
  };

  const handleToggleDarkMode = () => {
    toggleDarkMode(darkMode);
    window.location.reload();
  };

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position='static'>
      <Toolbar className={classes.toolbar}>
        <Link to='/' className={classes.navTitle}>
          Meet with friends
        </Link>

        {isLoading || isAuthenticated ? (
          <Box display='flex' justifyContent='center' alignItems='center'>
            <IconButton
              edge='start'
              color='inherit'
              aria-label='dark mode'
              onClick={handleToggleDarkMode}
            >
              {darkMode ? (
                <WbSunnyIcon className={classes.navIcon} />
              ) : (
                <NightsStayIcon className={classes.navIcon} />
              )}
            </IconButton>

            <Divider orientation='vertical' className={classes.divider} />

            <IconButton
              aria-label='account of current user'
              aria-controls='menu-appbar'
              aria-haspopup='true'
              onClick={handleMenu}
              color='inherit'
            >
              <AccountCircle className={classes.navIcon} />
            </IconButton>
            <Menu
              id='menu-appbar'
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={open}
              onClose={handleClose}
            >
              <MenuItem onClick={handleLogout} component={Link} to='/signin'>
                Sign Out
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <Box display='flex' justifyContent='center' alignItems='center'>
            <Link to='/signin' className={classes.navLink}>
              Sign In
            </Link>

            <Divider orientation='vertical' className={classes.divider} />

            <Link to='/signup' className={classes.navLink}>
              Sign Up
            </Link>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};
