import { Box, CircularProgress } from "@material-ui/core";
import { useEffect, useState } from "react";
import { Redirect, Route, Switch } from "react-router";
import { IUser } from "../api";
import { useAuth } from "../hooks/useAuth";
import { HomePage } from "../screens/HomePage/home-page";
import { NotFound } from "../screens/NotFound/not-found";
import { SignIn } from "../screens/SignIn/sign-in";
import { SignUp } from "../screens/SignUp/sign-up";

const RootRoutes = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const awaitAuthentication = async () => {
      const { user, isAuthenticated } = await useAuth();

      setUser(user);
      setIsAuthenticated(isAuthenticated);
      setIsLoading(false);
    };

    awaitAuthentication();
  }, []);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <Switch>
          {user?.isAdmin ? (
            <Route exact path="/signup" component={SignUp} />
          ) : (
            <Redirect from="/signup" to="/" />
          )}

          <Redirect from="/signin" to="/" />

          <Route exact path="/" component={HomePage} />
          <Route exact path="/meeting/join/:inviteToken" component={HomePage} />

          <Route component={NotFound} />
        </Switch>
      ) : (
        <Switch>
          <Route exact path="/signup" component={SignUp} />
          <Route exact path="/signin" component={SignIn} />

          <Redirect to="/signin" />
        </Switch>
      )}
    </>
  );
};

export default RootRoutes;
