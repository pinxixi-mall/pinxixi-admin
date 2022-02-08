
import React from 'react';
import { defaultRoutes, navMenus } from '@/router/routes';
const { Route, Redirect, Switch } = require('react-router-dom');

type RouterProps = {
    auth: any;
};

const createRoute = (r: any) => {
    const route = (r: any) => {
        const Component = r.component
        return (
            <Route
                key={r.route || r.path}
                exact
                path={r.route || r.path}
                render={(props: any) => {
                    const wrapper = (
                        <Component {...{ ...props, Comp: Component, route: r }} />
                    )
                    return wrapper
                }}
            />
        );
    };

    const subRoute = (r: any): any =>
        r.routes && r.routes.map((subR: any) => (subR.routes ? subRoute(subR) : route(subR)));

    return r.component ? route(r) : subRoute(r);
};

const defaultRouter = (props: RouterProps) => {
    return (
        <Switch>
            {defaultRoutes.map((menu) => createRoute(menu))}
        </Switch>
    );
}

const menuRouter = (props: RouterProps) => {
    return (
        <Switch>
            {navMenus.map((menu) => createRoute(menu))}
            <Route render={() => <Redirect to="/404" />} />
        </Switch>
    );
};

export {
    defaultRouter,
    menuRouter
}
