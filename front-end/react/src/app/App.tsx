import React from 'react';
import { createBrowserHistory } from 'history';
import { Router } from 'react-router';
import RootRoutes from './RootRoutes';
import { NavBar } from '../components/layout/navbar/navbar';
import { Body } from '../components/layout/body/body';

const history = createBrowserHistory();

const App = () => {
  return (
    <Router history={history}>
      <NavBar />

      <Body>
        <RootRoutes />
      </Body>
    </Router>
  );
};

export default App;
