import { Box, CircularProgress } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { useAuth } from '../hooks/useAuth';
import { HomePage } from '../screens/HomePage/home-page';
import { NotFound } from '../screens/NotFound/not-found';
import { SignIn } from '../screens/SignIn/sign-in';
import { SignUp } from '../screens/SignUp/sign-up';

const RootRoutes = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const awaitAuthentication = async () => {
      const { isAuthenticated } = await useAuth();

      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    };

    awaitAuthentication();
  }, []);

  if (isLoading) {
    return (
      <Box display='flex' justifyContent='center'>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Switch>
          <Redirect from='/signup' to='/' />
          <Redirect from='/signin' to='/' />

          <Route exact path='/' component={HomePage} />

          <Route component={NotFound} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path='/signup' component={SignUp} />
          <Route exact path='/signin' component={SignIn} />

          <Redirect to='/signin' />
        </Switch>
      )}
    </>
  );
};

export default RootRoutes;
