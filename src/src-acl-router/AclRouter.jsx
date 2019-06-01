import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Switch, Route, Redirect } from 'react-router-dom';
import map from 'lodash/map';
import isNil from 'lodash/isNil';
import omit from 'lodash/omit';

const omitRouteRenderProperties = route => (
  omit(route, ['render', 'component'])
);

const propTypes = {
  normalRoutes: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    redirect: PropTypes.string,
    component: PropTypes.func,
  })),
  normalLayout: PropTypes.func,
};

const defaultProps = {
  normalRoutes: [],
};

class AclRouter extends Component {
  renderRedirectRoute = route => (
    <Route
      key={route.path}
      {...omitRouteRenderProperties(route)}
      render={() => <Redirect to={route.redirect} />}
    />
  );

  /**
   * props pass to Layout & Component are history, location, match
   */
  renderUnAuthorizedRoute = (route) => {
    const { normalLayout: NormalLayout } = this.props;
    const { redirect, path, component: RouteComponent } = route;

    // check if current route is a redirect route (doesn't have component but redirect path)
    if (isNil(RouteComponent) && !isNil(redirect)) {
      return this.renderRedirectRoute(route);
    }

    return (
      <Route
        key={path}
        {...omitRouteRenderProperties(route)}
        render={props => (
          <NormalLayout {...props}>
            <RouteComponent {...props} />
          </NormalLayout>
        )}
      />
    );
  }

  render() {
    const { normalRoutes } = this.props;
    return (
      <Switch>
        {map(normalRoutes, route => (
          this.renderUnAuthorizedRoute(route)
        ))}
      </Switch>
    );
  }
}

AclRouter.propTypes = propTypes;
AclRouter.defaultProps = defaultProps;
export default AclRouter;
