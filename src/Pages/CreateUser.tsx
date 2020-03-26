import React, { FC, useState } from 'react';
import { Col, notification, Row, Switch, Typography } from 'antd';

import styles from './Users.module.scss';
import Icon from '../components/Icon';
import { faLongArrowLeft } from '@fortawesome/pro-regular-svg-icons';
import { Form } from './MyProfile';
import Title from 'antd/lib/typography/Title';
import { api } from '../services/api';
import moment from 'moment';

const { Text } = Typography;
const CreateUser: FC<any> = (props) => {
  const [user, setUser] = useState<any>({
    firstContributionDate: moment().format()
  });
  const {
    history: { goBack },
  } = props;

  const onChangeDates = (name: 'month' | 'year') => (e: any) => {
    const contributionMonth = moment(user.firstContributionDate).format('MMMM');
    if (name === 'month') {
      const firstContributionDate = moment(
        `28/${e.target.value}/${moment(user.firstContributionDate).format('YYYY')}`,
        'DD/MMMM/YYYY',
      ).format();
      setUser((user: any) => ({ ...user, firstContributionDate }));
      formAction({ ...user, firstContributionDate }).then();
    }
    if (name === 'year') {
      const newDate = moment(`28/${contributionMonth}/${e.target.value}`, 'DD/MMMM/YYYY').format();
      setUser((user: any) => ({ ...user, firstContributionDate: newDate }));
      formAction({ ...user, firstContributionDate: newDate }).then();
    }
  };

  const onChangeValues = (e: any) => {
    e.persist();
    setUser((s: any) => ({ ...s, [e.target.name]: e.target.value }));
  };
  const formAction = async (data: any) => {
    if (user.idNumber && user.firstContributionDate) {
        return await api.post('/auth/admin/users', data);
    }
  };

  const [loading, setLoading] = useState(false);
  const [sendLink, setSendLink] = useState(false);

  return (
    <Row>
      <Row className={styles.top}>
        <span />
        <Title style={{ marginBottom: 0 }} level={4}>
          Add a contributor
        </Title>
        <Icon onClick={() => goBack()} hover icon={faLongArrowLeft} />
      </Row>
      <div className={styles.row}>
        <Row className={styles.formHead}>
          <Col span={18}>
            <Text strong>Send a link to reset Password?</Text>
          </Col>
          <Col span={6}>
            <Switch onClick={() => setSendLink((value) => !value)} checked={sendLink} />
          </Col>
          <Col span={18}>
            <Text strong>Grant Admin rights</Text>
          </Col>
          <Col span={6}>
            <Switch
              onClick={() => setUser((u: any) => ({ ...u, role: u.role === 'admin' ? 'user' : 'admin' }))}
              checked={user.role === 'admin'}
            />
          </Col>
        </Row>
        <Form
          onChangeDates={onChangeDates}
          onChangeValues={onChangeValues}
          formAction={() => formAction({ ...user })}
          user={user}
          loading={loading}
          onFinish={() => {
            setLoading(true);
            formAction({ ...user }).then(() => {
              if (sendLink) {
                api.post('/auth/users/request-password', { idNumber: user.idNumber }).then();
              }
              setUser({firstContributionDate: moment().format()});
              setLoading(false);
            }).catch(() => {
              setLoading(false);
              notification.error({ message: 'An error occurred. Your request was not completed!. Try again'})
            })
          }}
        />
      </div>
    </Row>
  );
};

export default CreateUser;
