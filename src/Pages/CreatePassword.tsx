import React, { FC, useEffect, useState } from 'react';
import { Button, Col, Input, notification, Row, Typography } from 'antd';
import styles from './CreatePassword.module.scss';
import Icon from '../components/Icon';
import { faCheckCircle } from '@fortawesome/pro-solid-svg-icons';
import { api } from '../services/api';
import { Redirect } from 'react-router-dom';
import constants from '../Context/constants';

const { Text, Title } = Typography;
const CreatePassword: FC<any> = (props) => {
  const [value, setValue] = useState('');
  const validLength = value && value.length >= 8;

  const {
    history: {
      location: { search },
    },
  } = props;
  const onChange = (e: any) => {
    e.persist();
    setValue(e.target.value);
  };

  useEffect(() => {
    localStorage.clear();
  }, []);

  const uppercase = value && /[A-Z]+/.test(value);
  const lowercase = value && /[a-z]+/.test(value);
  const numberSpecial = value && /[^A-Za-z]/g.test(value);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await api.post(`/auth/users/create-password${search}`, { password: value });
      localStorage.setItem(constants.AUTH_KEY_TOKEN, response.data.token);
      setSuccess(true);
    } catch (error) {
      notification.error({
        message: 'An Error Occurred. Please try again',
      });
    }
    setLoading(false);
  };

  if (!search.includes('auth_key=') || !search.includes('id=')) {
    return <Redirect to="/exception/404" />;
  }

  if (success) {
    return <Redirect to="/" />;
  }

  return (
    <div className={styles.body}>
      <Row className={styles.row}>
        <Title style={{ textAlign: 'center', width: '100%' }} level={4}>
          New Password
        </Title>
        <Row className={styles.inputRow}>
          <Input.Password onChange={onChange} className={styles.input} />
        </Row>
        <Row className={styles.validation}>
          <Col>
            <Icon color={uppercase ? 'limegreen' : 'lightgray'} icon={faCheckCircle} />
            <Text style={{ color: uppercase ? 'limegreen' : 'lightgray' }}>1 UPPERCASE</Text>
          </Col>
          <Col>
            <Icon color={lowercase ? 'limegreen' : 'lightgray'} icon={faCheckCircle} />
            <Text style={{ color: lowercase ? 'limegreen' : 'lightgray' }}>1 lowercase</Text>
          </Col>
          <Col>
            <Icon color={numberSpecial ? 'limegreen' : 'lightgray'} icon={faCheckCircle} />
            <Text style={{ color: numberSpecial ? 'limegreen' : 'lightgray' }}>1 Number or Special character</Text>
          </Col>
          <Col>
            <Icon color={validLength ? 'limegreen' : 'lightgray'} icon={faCheckCircle} />
            <Text style={{ color: validLength ? 'limegreen' : 'lightgray' }}>At least 8 characters long</Text>
          </Col>
        </Row>
        <Row className={styles.inputRow}>
          <Button
            onClick={onSubmit}
            loading={loading}
            disabled={!validLength || !uppercase || !lowercase || !numberSpecial}
            className={styles.button}
          >
            Submit
          </Button>
        </Row>
      </Row>
    </div>
  );
};

export default CreatePassword;
