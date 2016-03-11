import React from 'react';
import {Route} from 'react-router';
import App from './components/App';
import SchoolList from './components/SchoolList';
import SchoolDetail from './components/SchoolDetail';
import CoachList from './components/CoachList';
import ShuttleList from './components/ShuttleList';
import GroundList from './components/GroundList';

export default (
  <Route component={App}>
    <Route path='/' component={SchoolList} />
    <Route path='/school/:id' component={SchoolDetail} />
    <Route path='/coachs/:id' component={CoachList} />
    <Route path='/shuttles/:id' component={ShuttleList} />
    <Route path='/grounds/:id' component={GroundList} />
  </Route>
);
