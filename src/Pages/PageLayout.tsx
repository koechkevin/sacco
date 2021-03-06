import React, { FC, useContext } from 'react';
import { Layout } from 'antd';
import Header from './Header';
import Sidebar from './Sidebar';
import { AppContext } from '../Context/AppContext';
import styles from './PageLayout.module.scss';

const { Content } = Layout;
const PageLayout: FC<any> = (props) => {
  const { children } = props;
  const { state } = useContext(AppContext);

  const { showLayout } = state;

  return showLayout ? (
    <Layout style={{ height: '100vh' }}>
      <Sidebar />
      <Content className={styles.body}>
        <Header />
        <Content className={styles.content}>{children}</Content>
      </Content>
    </Layout>
  ) : (
    children
  );
};

export default PageLayout;
