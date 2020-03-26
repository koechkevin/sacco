import React, { FC, useContext } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import { Config, routesConfig } from './routesConfig';
import Exception from '../Pages/Exceptions/Exception';
import { AppContext } from '../Context/AppContext';
import useLayout from '../Hooks/useLayout';

const AuthComponent: FC<any> = (props) => {
  const { component: Component, authenticated, allowedRoles, showLayout } = props;
  const {
    state: { auth, user },
  } = useContext(AppContext);
  useLayout(showLayout && auth.isLoggedIn);
  if (authenticated && !auth.isLoggedIn) {
    return <Redirect to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Exception {...props} exception={403} text="You are not authorized to access this page" />;
  }
  return <Component {...props} />;
};

const Routes: FC<any> = () => {
  return (
    <Switch>
      {routesConfig.map((each: Config, index: number) => (
        <Route key={index} exact path={each.path} component={(props: any) => <AuthComponent {...props} {...each} />} />
      ))}
    </Switch>
  );
};

export default Routes;
