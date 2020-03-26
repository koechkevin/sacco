import React, { FC, useContext } from 'react';
import { Drawer, Layout, Menu, Typography } from 'antd';
import { AppContext } from '../Context/AppContext';
import { useMedia } from 'react-use';
import styles from './SideMenu.module.scss';
import Title from 'antd/lib/typography/Title';
import Icon from '../components/Icon';
import { faHomeAlt } from '@fortawesome/pro-solid-svg-icons';
import SubMenu from 'antd/lib/menu/SubMenu';
import { faCog } from '@fortawesome/pro-regular-svg-icons';
import { Link } from 'react-router-dom';

const { Sider } = Layout;
const { Text } = Typography;

const ChildrenSideBar: FC<any> = (props) => {
  const {
    state: { user },
  } = useContext(AppContext);
  return (
    <div className={styles.children}>
      <div className={styles.brand}>
        <Title level={4}>Sacco</Title>
      </div>

      <div className={styles.homeLink}>
        <Icon icon={faHomeAlt} color="lightgray" />
        <Link to="/">
          <Text>My contributions</Text>
        </Link>
      </div>

      <Menu
        className={styles.settings}
        overflowedIndicator={<Icon color="lightgray" icon={faCog} />}
        theme="dark"
        defaultOpenKeys={['settings']}
        mode="inline"
      >
        <SubMenu
          key="settings"
          title={
            <div className={[styles.homeLink].join(' ')}>
              <Icon color="lightgray" icon={faCog} />
              <Text>Settings</Text>
            </div>
          }
        >
          <Menu.Item className={styles.item}>
            <Link to="/my-profile">My Profile</Link>
          </Menu.Item>
          {user.role === 'admin' && (
            <Menu.Item className={styles.item}>
              <Link to="/admin/users">Manage Users</Link>
            </Menu.Item>
          )}
          {user.role === 'admin' && (
            <Menu.Item className={styles.item}>
              <Link to="/admin/users/create">Add a contributor</Link>
            </Menu.Item>
          )}
        </SubMenu>
      </Menu>
      <div className={styles.footer}>
        <div>
          <a href="https://my-resume-92231.firebaseapp.com/koechkevin">powered by Awesome Dev</a>
        </div>
        <div style={{ textAlign: 'center' }}>&copy; 2020</div>
      </div>
    </div>
  );
};
const Sidebar: FC<any> = (props) => {
  const { dispatch, state } = useContext(AppContext);
  const { drawerOpen } = state;
  const isMobile: boolean = useMedia('(max-width:575px)');
  return (
    <>
      {!isMobile && (
        <Sider style={{ overflowY: 'scroll', height: '100vh', padding: 0 }}>
          <ChildrenSideBar {...props} />
        </Sider>
      )}
      {isMobile && (
        <Drawer
          style={{ overflowY: 'scroll', height: '100vh' }}
          width={200}
          className={styles.drawer}
          closable={false}
          placement="left"
          onClose={() => dispatch && dispatch({ drawerOpen: false })}
          visible={drawerOpen}
        >
          <ChildrenSideBar {...props} />
        </Drawer>
      )}
    </>
  );
};

export default Sidebar;
