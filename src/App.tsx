import React from 'react';
import Layout from '@/layout/layout';
import Login from '@/views/login';
import NotFound from '@/views/404';
import { menuRouter as MenuRoutes } from '@/router'
import './App.css';
const { HashRouter, Route, Switch, Redirect } = require("react-router-dom")

const App: React.FC = (props): any => {
  return (
    <HashRouter>
      <Switch>
        <Route exact path="/" render={() => <Redirect to="/dashboard" push />} />
        <Route path="/login" component={Login} />
        <Route path="/404" component={NotFound} />
        <Layout>
          <MenuRoutes auth={{}} />
        </Layout>
        <Route component={NotFound} />
      </Switch>
    </HashRouter>
  )
}

export default App;
