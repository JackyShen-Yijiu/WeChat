import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import SchoolList from './components/SchoolList';

export default (
  <Route component={App}>
    <Route path='/' component={SchoolList} />
  </Route>
);
