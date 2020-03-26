import React, { FC, useContext, useEffect, useState } from 'react';

import styles from './Login.module.scss';
import { Button, Input, notification, Row, Typography } from 'antd';
import { AppContext } from '../Context/AppContext';
import { api } from '../services/api';
import constants from '../Context/constants';
import { Redirect } from 'react-router-dom';

const { Title, Text } = Typography;
const Login: FC<any> = () => {
  const {
    dispatch,
    state: { auth },
  } = useContext(AppContext);
  const [error, setError] = useState(false);
  const [credentials, setCredentials] = useState({
    id: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  const onChange = (e: any) => {
    e.persist();
    setCredentials((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', credentials);
      setLoading(false);
      localStorage.setItem(constants.AUTH_KEY_TOKEN, response.data.token);
      dispatch && dispatch({ currentUserRole: response.data.role });
    } catch (error) {
      setLoading(false);
      setError(true);
    }
  };

  const onRequestPassword = async () => {
    setLoading(true);
    try {
      await api.post('/auth/users/request-password', { idNumber: credentials.id });
      notification.success({
        message: 'An email has been successfully sent to you. Please follow the link to reset your password',
      });
      setForgotPassword(false);
    } catch (error) {
      setError(true);
    }
    setLoading(false);
  };
  const [forgotPassword, setForgotPassword] = useState(false);
  if (auth.isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <div className={styles.div}>
        <Row className={styles.login}>
          {!forgotPassword ? (
            <>
              <Title level={4}>Login</Title>
              <Text style={{ marginLeft: 8, marginTop: 16 }}>Id Number</Text>
              <Input
                name="id"
                onChange={onChange}
                style={{ borderColor: error ? 'red' : '' }}
                className={styles.input}
              />
              <div style={{ marginLeft: 8, marginTop: 16 }}>
                <Text>Password</Text>
              </div>
              <Input.Password
                name="password"
                onChange={onChange}
                style={{ borderColor: error ? 'red' : '' }}
                className={styles.input}
              />
              <div className={styles.error}>{error && `Oops! that's not a match`}</div>
            </>
          ) : (
            <>
              <Text style={{ marginBottom: 16 }}>
                Enter your id number below we will send you a link to reset your password via email you provided.
              </Text>
              <Input
                name="id"
                onChange={onChange}
                style={{ borderColor: error ? 'red' : '' }}
                className={styles.input}
              />
            </>
          )}
          <div>
            <Text style={{ marginLeft: 8, marginTop: 8, color: '#0050c8', cursor: 'pointer' }} strong>
              <span onClick={() => setForgotPassword((value) => !value)}>
                {forgotPassword ? 'Back to Login' : 'Forgot Password?'}
              </span>
            </Text>
          </div>
          <Button
            loading={loading}
            onClick={forgotPassword ? onRequestPassword : onSubmit}
            className={styles.button}
            type="primary"
          >
            {!forgotPassword ? 'Login' : 'Send'}
          </Button>
        </Row>
      </div>
    </>
  );
};
export default Login;
