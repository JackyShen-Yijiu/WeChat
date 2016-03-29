import React from 'react';
import { Route } from 'react-router';
import App from './components/App';
import SchoolList from './components/SchoolList';
import SchoolDetail from './components/SchoolDetail';
import CoachList from './components/CoachList';
import CoachDetail from './components/CoachDetail';
import ShuttleList from './components/ShuttleList';
import GroundList from './components/GroundList';
import CityList from './components/CityList';
import UserCenter from './components/UserCenter';
import SignUp from './components/SignUp';
import CostPay from './components/CostPay';
import SceneSuccess from './components/SceneSuccess';
import WechatSuccess from './components/WechatSuccess';
import Search from './components/Search';
import CollectYcode from './components/CollectYcode';

export default (
    <Route component={App}>
        <Route path='/' component={SchoolList} />
        <Route path='/cities' component={CityList} />
        <Route path=':city_name/schools' component={SchoolList} />
        <Route path='/school/:id' component={SchoolDetail} />
        <Route path='/school/:school_id/coachs' component={CoachList} />
        <Route path='/school/:school_id/coachs/:lesson_id' component={CoachList} />
        <Route path='/coach/:id' component={CoachDetail} />
        <Route path='/school/:school_id/shuttles' component={ShuttleList} />
        <Route path='/school/:school_id/grounds' component={GroundList} />
        <Route path='/user' component={UserCenter} />
        <Route path='/signup/:school_id/:coach_id/:lesson_id' component={SignUp} />
        <Route path='/pay/:school_id/:coach_id/:lesson_id' component={CostPay} />
        <Route path='/successful' component={SceneSuccess} />
        <Route path='/wechatsuccessful' component={WechatSuccess} />
        <Route path='/search' component={Search} />
        <Route path='/ycode' component={CollectYcode} />
    </Route>
);
