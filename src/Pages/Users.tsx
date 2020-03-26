import React, { FC, useContext } from 'react';
import { Row, List, Avatar, Typography, Button } from 'antd';
import { AppContext } from '../Context/AppContext';
import { UserOutlined } from '@ant-design/icons';
import styles from './Users.module.scss';
import { Link, Redirect } from 'react-router-dom';
import useLayout from '../Hooks/useLayout';
import Exception from './Exceptions/Exception';
import Loader from '../components/Loader';

const { Text } = Typography;

const Users: FC<any> = () => {
  const {
    state: {
      users,
      user,
      usersLoading,
      auth: { isLoggedIn },
    },
  } = useContext(AppContext);

  if (!isLoggedIn) {
    return <Redirect to="/" />;
  }

  if (user.role !== 'admin') {
    return <Exception exception={403} text="You are not authorized to access this page" />;
  }

  return (
    <Row>
      <Row className={styles.top}>
        <Link to="/admin/users/create">
          <Button style={{ borderRadius: 8, borderColor: '#0050c8', color: '#0050c8' }}>Add a User</Button>
        </Link>
        <div>
          <Text strong style={{ fontSize: 20, color: '#1d1d1d' }}>{`Total Users ${users.length}`}</Text>
        </div>
      </Row>
      <Row className={styles.listRow}>
        {usersLoading ? (
          <Loader />
        ) : (
          <List
            dataSource={users}
            className={styles.list}
            renderItem={(item: any) => (
              <List.Item className={styles.item}>
                <List.Item.Meta
                  avatar={<Avatar icon={<UserOutlined />} />}
                  title={
                    <Link to={`/admin/users/${item.idNumber}`}>
                      <Text style={{ color: '#1d1d1d' }}>{`${item.firstName} ${item.lastName}`}</Text>
                    </Link>
                  }
                  description={
                    <div style={{ display: 'flex' }}>
                      <Text>{item.email}</Text>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        )}
      </Row>
    </Row>
  );
};

export default Users;
