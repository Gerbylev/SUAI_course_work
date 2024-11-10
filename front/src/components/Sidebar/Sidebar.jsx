import React from 'react';
import { Menu } from 'antd';
import { Link } from 'react-router-dom';
import './Sidebar.scss';

const completedTasks = [
  { id: 1, title: 'Задание 1' },
  { id: 2, title: 'Задание 2' },
  { id: 3, title: 'Задание 3' },
];

const Sidebar = () => (
  <div className="sidebar">
    <Menu mode="inline" style={{ height: '100%' }}>
      {completedTasks.map((task) => (
        <Menu.Item key={task.id}>
          <Link to={`/task/${task.id}`}>{task.title}</Link>
        </Menu.Item>
      ))}
    </Menu>
  </div>
);

export default Sidebar;