import React from 'react';
import { Layout } from 'antd';
import Topbar from '../Topbar/Topbar';
import Sidebar from '../Sidebar/Sidebar';
import './Layout.scss';

const { Header, Sider, Content } = Layout;

const MainLayout = ({ children }) => (
  <Layout>
    <Header className="layout-header">
      <Topbar />
    </Header>
    <Layout>
      <Sider className="layout-sider">
        <Sidebar />
      </Sider>
      <Content className="layout-content">
        {children}
      </Content>
    </Layout>
  </Layout>
);

export default MainLayout;
