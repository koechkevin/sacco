import React, { FC, useContext } from 'react';
import styles from './Header.module.scss';
import Icon from '../components/Icon';
import { faCog, faPowerOff, faStream, faUser } from '@fortawesome/pro-regular-svg-icons';
import { useMedia } from 'react-use';
import { AppContext } from '../Context/AppContext';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Dropdown, Menu, Typography } from 'antd';
import Text from 'antd/lib/typography/Text';
import { Link } from 'react-router-dom';

const Layout: FC<any> = () => {
  const {
    state: { user },
  } = useContext(AppContext);
  return (
    <Menu className={styles.menu}>
      <Menu.Item className={[styles.item, styles.account].join(' ')} style={{ height: 200 }} onClick={() => {}}>
        <Avatar icon={<UserOutlined style={{ fontSize: 32 }} />} size={64} />
        <Text strong>{`${user.firstName || ''} ${user.lastName || ''}`}</Text>
        <Text>{user.idNumber || ''}</Text>
        <Text>{user.email || ''}</Text>
        <Button className={styles.button}>
          <Link to="/my-profile">Manage your Account</Link>
        </Button>
      </Menu.Item>
      {user.role === 'admin' && (
        <Menu.Item className={styles.item}>
          <Icon color="rgba(0, 0, 0, 0.65)" icon={faCog} />
          <Link to="/admin/users">
            <Text>Manage Users</Text>
          </Link>
        </Menu.Item>
      )}
      {user.role === 'admin' && (
        <Menu.Item className={styles.item}>
          <Icon color="rgba(0, 0, 0, 0.65)" icon={faUser} />
          <Link to="/admin/users/create">
            <Text>Add a contributor</Text>
          </Link>
        </Menu.Item>
      )}
      <Menu.Divider />
      <Menu.Item onClick={() => localStorage.clear()} className={styles.item}>
        <Icon color="rgba(0, 0, 0, 0.65)" icon={faPowerOff} />
        <Typography.Text>Logout</Typography.Text>
      </Menu.Item>
    </Menu>
  );
};
const Header: FC<any> = () => {
  const isMobile: boolean = useMedia('(max-width: 575px)');
  const {
    dispatch,
    state: { drawerOpen },
  } = useContext(AppContext);
  return (
    <div className={styles.header}>
      <div>
        {isMobile && !drawerOpen && (
          <Icon onClick={() => dispatch && dispatch({ drawerOpen: true })} hover icon={faStream} />
        )}
      </div>
      <div>
        <Dropdown trigger={['click']} overlay={<Layout />}>
          <Avatar style={{ cursor: 'pointer' }} icon={<UserOutlined />} size={32} />
        </Dropdown>
      </div>
    </div>
  );
};

export default Header;
