
import React from "react";
import Layout from '@/layout/layout';
import Login from "@/views/login/login";
import Home from "@/views/home/home";
import HomeBanner from "@/views/productManage/homeBanner";
import HomeRecommend from "@/views/productManage/homeRecommend";
const { HashRouter, Switch, Route, Redirect } = require("react-router-dom");

const Routes = () => {
  return (
    <HashRouter>
      <Switch>
        <Route path='/login' component={Login} />
        <Layout>
          <Switch>
            <Route path="/" render={() =>
              <Switch>
                <Route path='/home' component={Home} />
                <Route path='/home-banner' component={HomeBanner} />
                <Route path='/home-recommend' component={HomeRecommend} />
                <Redirect to="/home" />
              </Switch>
            } />
          </Switch>
        </Layout>
      </Switch>
    </HashRouter>
  );
};

export default Routes;