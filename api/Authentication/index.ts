// tslint:disable-next-line:no-var-requires
import { allowRoles, authenticate, login } from './login';

const express = require('express');

import {
  adminRegisterUser, adminUpdate,
  fillNewPassword,
  getUserData, listUsers, sendPassWordResetLink,
  updateMyProfile,
  validateAdminCreate,
  validateNewPassword,
} from './register';

const  { Router }: any = express;

const authentication: any = Router();
authentication.post('/admin/users', authenticate, allowRoles(['admin']), validateAdminCreate, adminRegisterUser);
authentication.put('/admin/users', authenticate, allowRoles(['admin']), adminUpdate);
authentication.get('/admin/users', authenticate, allowRoles(['admin']), listUsers);
authentication.post('/users/create-password', validateNewPassword, fillNewPassword, login);
authentication.post('/users/request-password', sendPassWordResetLink);
authentication.get('/users/user', authenticate, getUserData);
authentication.put('/users/my-profile', authenticate, updateMyProfile);
authentication.post('/login', login);

export default authentication;
