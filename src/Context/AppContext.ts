import { createContext } from 'react';

export interface State {
  showLayout: boolean,
  showSidebar: boolean,
  showHeader: boolean,
  drawerOpen: boolean,
  users: any[],
  auth: {
    isLoggedIn: boolean,
    idNumber?: string | number,
    role?: string;
  }
  user: any;
  usersLoading: boolean;
}
export interface Context {
  state: State,
  dispatch?: (value: any) => void;
}
export const AppContext = createContext<Context>({
  state: {
    showLayout: false,
    showSidebar: false,
    showHeader: false,
    drawerOpen: false,
    auth: {
      isLoggedIn: true,
    },
    user: {},
    users: [],
    usersLoading: false,
  }, dispatch: undefined,
});
