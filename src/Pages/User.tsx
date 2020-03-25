import React, { FC, useContext, useEffect, useState } from 'react';
import { Col, Row, Switch } from 'antd';
import { AppContext } from '../Context/AppContext';
import { Form, View } from './MyProfile';

import styles from './User.module.scss';
import Icon from '../components/Icon';
import { faPencilAlt } from '@fortawesome/pro-regular-svg-icons';
import Title from 'antd/lib/typography/Title';
import moment from 'moment';
import { api } from '../services/api';
import Text from 'antd/lib/typography/Text';
import Exception from './Exceptions/Exception';
import { Redirect } from 'react-router';

const User: FC<any> = (props) => {
  const {
    match: {
      params: { id },
    },
  } = props;

  const {
    dispatch,
    state: { showHeader, showLayout, showSidebar, auth, users, user },
  } = useContext(AppContext);

  const [current, setCurrent] = useState<any>({});
  useEffect(() => {
    const user = users.find((one) => one.idNumber.toString() === id) || {};
    setCurrent(user);
  }, [users, id]);
  useEffect(() => {
    if (dispatch && (!showSidebar || !showHeader || !showLayout)) {
      dispatch({
        showSidebar: true,
        showHeader: true,
        showLayout: true,
      });
    }
  }, [dispatch, showHeader, showLayout, showSidebar]);
  const [editing, setEditing] = useState(false);

  const formAction = async (data: any) => {
    try {
      await api.put('/auth/admin/users', data);
    } catch (error) {}
  };

  const onChangeDates = (name: 'month' | 'year') => (e: any) => {
    const contributionYear = moment(current.firstContributionDate).format('YYYY');
    const contributionMonth = moment(current.firstContributionDate).format('MMMM');
    if (name === 'month') {
      const firstContributionDate = moment(`28/${e.target.value}/${contributionYear}`, 'DD/MMMM/YYYY').format();
      setCurrent((user: any) => ({ ...user, firstContributionDate }));
      formAction({ ...current, firstContributionDate }).then();
    }
    if (name === 'year') {
      const newDate = moment(`28/${contributionMonth}/${e.target.value}`, 'DD/MMMM/YYYY').format();
      setCurrent((user: any) => ({ ...user, firstContributionDate: newDate }));
      formAction({ ...current, firstContributionDate: newDate }).then();
    }
  };
  const onChangeValues = (e: any) => {
    e.persist();
    setCurrent((values: any) => ({ ...values, [e.target.name]: e.target.value }));
  };

  const onCheck = () => {
    const role = current.role === 'admin' ? 'user' : 'admin';
    setCurrent((c: any) => ({ ...c, role }));
    formAction({ idNumber: id, role }).then();
  };

  if (!auth.isLoggedIn) {
    return <Redirect to="/" />;
  }

  if (user.role !== 'admin') {
    return <Exception exception={403} text="You are not authorized to access this page"/>
  }

  return (
    <Row className={styles.row}>
      <Col className={styles.header}>
        <Title level={4}>{`${current.firstName || ''} ${current.lastName || ''}`}</Title>
        {!editing && <Icon onClick={() => setEditing((value) => !value)} hover icon={faPencilAlt} />}
      </Col>
      <Row className={styles.switch}>
        <Text>{`Grant ${current.firstName || ''} ${current.lastName || ''} Admin rights`}</Text>
        <Switch
          onClick={onCheck}
          disabled={auth.idNumber?.toString() === id}
          checked={current.role === 'admin'}
          className={styles.btn}
          style={{ height: 16 }}
        />
      </Row>
      {!editing ? (
        <View user={current} />
      ) : (
        <Form
          onChangeDates={onChangeDates}
          onChangeValues={onChangeValues}
          formAction={() => formAction({ ...current })}
          user={current}
          onFinish={() => {
            setEditing(false);
            formAction({ ...current }).then();
          }}
        />
      )}
    </Row>
  );
};
export default User;
