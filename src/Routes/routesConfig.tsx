import LandingPage from '../Pages/LandingPage';
import Login from '../Pages/Login';
import MyProfile from '../Pages/MyProfile';
import CreatePassword from '../Pages/CreatePassword';
import Users from '../Pages/Users';
import CreateUser from '../Pages/CreateUser';
import User from '../Pages/User';
import Exception from '../Pages/Exceptions/Exception';
import React from 'react';

export interface Config {
  name?: string;
  path: string;
  allowedRoles?: string[];
  authenticated: boolean;
  component: any;
  showLayout: boolean;
}

export const routesConfig: Config[] = [
  {
    name: 'Home Page',
    component: LandingPage,
    path: '/',
    authenticated: true,
    showLayout: true,
  },
  {
    name: 'Login',
    component: Login,
    path: '/login',
    authenticated: false,
    showLayout: false,
  },
  {
    name: 'My Profile',
    component: MyProfile,
    path: '/my-profile',
    authenticated: true,
    showLayout: true,
  },
  {
    name: '',
    component: CreatePassword,
    path: '/auth/create-password',
    authenticated: false,
    showLayout: false,
  },
  {
    name: '',
    component: Users,
    path: '/admin/users',
    authenticated: true,
    allowedRoles: ['admin'],
    showLayout: true,
  },
  {
    name: '',
    component: CreateUser,
    path: '/admin/users/create',
    authenticated: true,
    allowedRoles: ['admin'],
    showLayout: true,
  },
  {
    name: '',
    component: User,
    path: '/admin/users/:id',
    authenticated: true,
    allowedRoles: ['admin'],
    showLayout: true,
  },
  {
    name: '404',
    component: () => <Exception exception={404} text="Sorry, the page you visited does not exist" />,
    path: '/exception/404',
    authenticated: false,
    showLayout: true,
  },
  {
    name: '403',
    component: () => (
      <Exception exception={403} text="You are not authorized to access this page. Please login to continue" />
    ),
    path: '/exception/403',
    authenticated: false,
    showLayout: true,
  },
  {
    name: '404',
    component: () => <Exception exception={404} text="Sorry, the page you visited does not exist" />,
    path: '',
    authenticated: false,
    showLayout: true,
  },
];
