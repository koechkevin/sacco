import React, { useEffect, useState } from 'react';
import { BrowserRouter } from 'react-router-dom';
import jwtDecode from 'jwt-decode';
import 'antd/dist/antd.css';
import PageLayout from './Pages/PageLayout';
import { AppContext, State } from './Context/AppContext';
import constants from './Context/constants';
import { api } from './services/api';
import Routes from './Routes/Routes';
import Loader from './components/Loader';

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
    usersLoading: false,
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
        setState((s) => ({ ...s, auth: { isLoggedIn: false }, user: {}, users: [] }));
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
      setState((s) => ({ ...s, usersLoading: true }));
      api
        .get('/auth/admin/users')
        .then((res) => {
          setState((stat) => ({ ...stat, users: res.data.users }));
          setState((s) => ({ ...s, usersLoading: false }));
        })
        .catch(() => setState((s) => ({ ...s, usersLoading: false })));
    }
  }, [state.user]);

  if (loading) {
    return <Loader />;
  }

  return (
    <AppContext.Provider value={{ state, dispatch: (value: any) => setState((s) => ({ ...s, ...value })) }}>
      <BrowserRouter>
        <PageLayout>
          <Routes />
        </PageLayout>
      </BrowserRouter>
    </AppContext.Provider>
  );
};

export default App;
