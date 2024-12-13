import React from 'react';
import { Layout } from 'antd';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import { observer } from "mobx-react-lite";
import { userStore } from '../../userStore';
import './Layout.scss';

const { Header, Sider, Content } = Layout;

const MainLayout = observer(({ children, hasSidebar = true }) => {
  return (
    <Layout>
      <Header className="layout-header">
        <Topbar isLogin={userStore.isLogin} />
      </Header>
      <Layout>
        {/* {(hasSidebar && userStore.isLogin) && (
          <Sider className="layout-sider">
            <Sidebar />
          </Sider>
        )} */}
        <Content className="layout-content">{children}</Content>
      </Layout>
    </Layout>
  );
});

export default MainLayout;