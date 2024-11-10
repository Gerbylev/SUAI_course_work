import React from 'react';
import { Input } from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Topbar.scss';

const Topbar = () => (
  <div className="topbar">
    <Link to="/" className="topbar-logo">
      <img src={logo} alt="Logo" />
    </Link>
    <Input
      placeholder="Поиск"
      prefix={<SearchOutlined />}
      className="topbar-search"
    />
    <div className="topbar-user">
      <UserOutlined />
    </div>
  </div>
);

export default Topbar;
