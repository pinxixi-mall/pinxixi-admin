
import { otherRoutes, navRoutes } from '@/router/routes';
import DocumentTitle from 'react-document-title';
import Layout from '@/layout/layout';
const { Route, Redirect, Switch } = require('react-router-dom');

type RouteProps = {
    auth: any;
};

const createRoute = (r: any) => {
    const route = (r: any) => {
        const Component = r.component
        const docTitle = r.meta ? `${r.meta.title}-拼夕夕` : '拼夕夕'
        return (
            <Route
                key={r.route || r.path}
                exact
                path={r.route || r.path}
                render={(props: any) => {
                    const wrapper = (
                        <DocumentTitle title={docTitle}>
                            <Component {...{ ...props, Comp: Component, route: r }} />
                        </DocumentTitle>
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

const Routes = (props: RouteProps) => {
    return (
        <Switch>
          <Route exact path="/" render={() => <Redirect to="/dashboard" push />} />
          {otherRoutes.map((r) => createRoute(r))}
          <Layout>
            <Switch>
                {navRoutes.map((r) => createRoute(r))}
                <Route render={() => <Redirect to="/404" />} />
            </Switch>
          </Layout>
        </Switch>
    );
};

export default Routes
