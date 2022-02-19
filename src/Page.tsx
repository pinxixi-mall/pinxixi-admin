import React from 'react';
// import NotFound from './components/pages/NotFound';
import Login from "@/views/login";
import App from './App';
const { HashRouter: Router, Route, Switch, Redirect } =require('react-router-dom');

export default () => (
    <Router>
        <Switch>
            {/* <Route exact path="/" render={() => <Redirect to="/app/dashboard/index" push />} /> */}
            <Route path="/" component={App} />
            {/* <Route path="/404" component={NotFound} /> */}
            <Route path="/login" component={Login} />
            {/* <Route component={NotFound} /> */}
        </Switch>
    </Router>
);
