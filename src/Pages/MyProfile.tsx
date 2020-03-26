import React, { FC, useContext, useState } from 'react';
import { Button, Col, Input, Row, Typography } from 'antd';
import { AppContext } from '../Context/AppContext';
import styles from './MyProfile.module.scss';
import Icon from '../components/Icon';
import { faPencilAlt } from '@fortawesome/pro-regular-svg-icons';
import { currencyFormat } from '../utils';
import moment from 'moment';
import { useMedia } from 'react-use';
import { api } from '../services/api';
import useLayout from '../Hooks/useLayout';

const { Title, Text } = Typography;
export const View: FC<any> = (props) => {
  const { user } = props;
  const monthlyContribution = +user.monthlyContribution || 0.0;
  return (
    <Row className={styles.view} style={{ width: '100%' }} gutter={16}>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>First Name</Text>
        <Text className={styles.field}>{user.firstName}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>First Name</Text>
        <Text className={styles.field}>{user.lastName}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>Id Number</Text>
        <Text className={styles.field}>{user.idNumber}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>PF Number</Text>
        <Text className={styles.field}>{user.pfNumber}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>Email</Text>
        <Text className={styles.field}>{user.email}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>Phone Number</Text>
        <Text className={styles.field}>{(user.phone && `+254 ${user.phone || ''}`) || '-'}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>Monthly Contribution</Text>
        <Text className={styles.field}>{currencyFormat(monthlyContribution)}</Text>
      </Col>
      <Col style={{ display: 'flex', flexDirection: 'column', marginBottom: 16 }} xs={24} sm={12}>
        <Text className={styles.label}>First Contribution Date</Text>
        <Text className={styles.field}>{moment(user.firstContributionDate).format('MMMM YYYY')}</Text>
      </Col>
    </Row>
  );
};

export const Form: FC<any> = (props) => {
  const { user, onFinish, onChangeValues, onChangeDates, formAction, disabled, loading } = props;
  const {
    state: { user: currentUser },
  } = useContext(AppContext);
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];
  const years = Array(160)
    .fill(1940)
    .map((e, i) => e + i);

  const isMobile = useMedia('(max-width: 575px)');

  const rowStyles = { marginLeft: 0, marginRight: 0 };
  const colStyles = { paddingLeft: 0, paddingRight: 0 };
  return (
    <Row className={styles.form} style={{ width: '100%', ...(isMobile && rowStyles) }} gutter={16}>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>First Name</Text>
        <Input
          onBlur={formAction}
          onChange={onChangeValues}
          name="firstName"
          value={user.firstName}
          className={styles.input}
        />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>Last Name</Text>
        <Input
          onBlur={formAction}
          onChange={onChangeValues}
          name="lastName"
          value={user.lastName}
          className={styles.input}
        />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>Id Number</Text>
        <Input
          disabled={disabled}
          onChange={onChangeValues}
          name="idNumber"
          value={user.idNumber}
          className={styles.input}
        />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>PF Number</Text>
        <Input
          disabled={disabled}
          onChange={onChangeValues}
          name="pfNumber"
          value={user.pfNumber}
          className={styles.input}
        />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>Email</Text>
        <Input onBlur={formAction} onChange={onChangeValues} name="email" value={user.email} className={styles.input} />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>Phone Number</Text>
        <Input
          onBlur={formAction}
          placeholder="7XXXXXX"
          onChange={onChangeValues}
          name="phone"
          type="number"
          value={user.phone}
          className={styles.input}
        />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>Monthly Contribution</Text>
        <Input
          onBlur={formAction}
          disabled={disabled || currentUser.role !== 'admin'}
          onChange={onChangeValues}
          name="monthlyContribution"
          type="number"
          value={user.monthlyContribution}
          className={styles.input}
        />
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>First Contribution Month</Text>
        <select
          value={moment(user.firstContributionDate).format('MMMM')}
          onChange={onChangeDates('month')}
          className={[styles.select, disabled ? styles.disabled : ''].join(' ')}
          disabled={disabled}
        >
          {months.map((each: string) => (
            <option value={each} disabled={disabled || currentUser.role !== 'admin'} key={each}>
              {each}
            </option>
          ))}
        </select>
      </Col>
      <Col
        style={{ display: 'flex', flexDirection: 'column', marginBottom: 16, ...(isMobile && colStyles) }}
        xs={24}
        sm={12}
      >
        <Text className={styles.label}>Year</Text>
        <select
          onChange={onChangeDates('year')}
          value={moment(user.firstContributionDate).format('YYYY')}
          className={[styles.select, disabled ? styles.disabled : ''].join(' ')}
          disabled={disabled}
        >
          {years.map((each: string) => (
            <option disabled={disabled || currentUser.role !== 'admin'} key={each}>
              {each}
            </option>
          ))}
        </select>
      </Col>
      <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
        <Button loading={loading} onClick={onFinish} className={styles.button} type="primary">
          Finish
        </Button>
      </div>
    </Row>
  );
};
const MyProfile: FC<any> = () => {
  const {
    dispatch,
    state: { user },
  } = useContext(AppContext);
  const [editing, setEditing] = useState(false);
  useLayout(true);

  const onChangeValues = (e: any) => {
    e.persist();
    dispatch && dispatch({ user: { ...user, [e.target.name]: e.target.value } });
  };

  const formAction = async (data: any) => {
    try {
      await api.put('/auth/users/my-profile', data);
    } catch (e) {}
  };

  const onChangeDates = (name: 'month' | 'year') => (e: any) => {
    const { firstContributionDate } = user;
    const contributionYear = moment(firstContributionDate).format('YYYY');
    const contributionMonth = moment(firstContributionDate).format('MMMM');
    let newDate = firstContributionDate;
    if (name === 'month') {
      newDate = moment(`28/${e.target.value}/${contributionYear}`, 'DD/MMMM/YYYY').format();
    }
    if (name === 'year') {
      newDate = moment(`28/${contributionMonth}/${e.target.value}`, 'DD/MMMM/YYYY').format();
    }
    dispatch && dispatch({ user: { ...user, firstContributionDate: newDate } });
    formAction({ ...user, firstContributionDate: newDate }).then();
  };

  return (
    <Row className={styles.profile}>
      <Col className={styles.header}>
        <Title level={4}>My Profile</Title>
        {!editing && <Icon onClick={() => setEditing((value) => !value)} hover icon={faPencilAlt} />}
      </Col>
      {!editing ? (
        <View user={user} />
      ) : (
        <Form
          disabled
          onChangeDates={onChangeDates}
          onChangeValues={onChangeValues}
          formAction={() => formAction({ ...user })}
          user={user}
          onFinish={() => {
            setEditing(false);
            formAction({ ...user }).then();
          }}
        />
      )}
    </Row>
  );
};

export default MyProfile;
