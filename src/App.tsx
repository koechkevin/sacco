import React, { useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Exception404 from './Pages/Exceptions/Exception';
import jwtDecode from 'jwt-decode';
import 'antd/dist/antd.css';
import Login from './Pages/Login';
import PageLayout from './Pages/PageLayout';
import { AppContext, State } from './Context/AppContext';
import LandingPage from './Pages/LandingPage';
import constants from './Context/constants';
import { api } from './services/api';
import MyProfile from './Pages/MyProfile';
import Users from './Pages/Users';
import CreateUser from './Pages/CreateUser';
import User from './Pages/User';
import CreatePassword from './Pages/CreatePassword';

const App = () => {
  const [state, setState] = useState<State>({
    showLayout: false,
    showSidebar: true,
    showHeader: true,
    drawerOpen: false,
    auth: {
      isLoggedIn: true,
    },
    user: {},
    users: [],
  });

  const [authKey, setAuthKey] = useState(localStorage.getItem(constants.AUTH_KEY_TOKEN) || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setAuthKey(localStorage.getItem(constants.AUTH_KEY_TOKEN) || '');
    const interval = setInterval(() => {
      setAuthKey(localStorage.getItem(constants.AUTH_KEY_TOKEN) || '');
    }, 500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    try {
      const decoded: any = jwtDecode(authKey);
      const { data } = decoded;
      if (data && data.idNumber) {
        setState((s) => ({ ...s, auth: { isLoggedIn: true, ...data } }));
      } else {
        setState((s) => ({ ...s, auth: { isLoggedIn: false }, user: {}, users: []}));
      }
    } catch (error) {
      setState((s) => ({ ...s, auth: { isLoggedIn: false }, user: {}, users: [] }));
    }
  }, [authKey]);

  useEffect(() => {
    if (authKey) {
      setLoading(true);
      api
        .get('/auth/users/user')
        .then((res) => {
          setState((s) => ({ ...s, user: res.data.user }));
          setLoading(false);
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [authKey]);

  useEffect(() => {
    if (state.user && state.user.role === 'admin') {
      api
        .get('/auth/admin/users')
        .then((res) => {
          setState((stat) => ({...stat, users: res.data.users}))
        })
        .catch(console.log);
    }
  }, [state.user]);

  if (loading) {
    return <>Loading...</>
  }

  return (
    <AppContext.Provider value={{ state, dispatch: (value: any) => setState((s) => ({ ...s, ...value })) }}>
      <BrowserRouter>
        <PageLayout>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/my-profile" component={MyProfile} />
            <Route exact path="/auth/create-password" component={CreatePassword} />
            <Route exact path="/admin/users" component={Users} />
            <Route exact path="/admin/users/create" component={CreateUser}/>
            <Route exact path="/admin/users/:id" component={User} />
            <Route
              exact
              path="/exception/404"
              render={() => <Exception404 exception={404} text="Sorry, the page you visited does not exist." />}
            />
            <Route
              exact
              path="/exception/403"
              render={() => (
                <Exception404
                  exception={403}
                  text="You are not authorized to access this page. Please login to continue"
                />
              )}
            />
            <Route
              exact
              path=""
              render={() => <Exception404 exception={404} text="Sorry, the page you visited does not exist." />}
            />
          </Switch>
        </PageLayout>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
