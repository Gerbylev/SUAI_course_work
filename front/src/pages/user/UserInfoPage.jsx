import React from 'react';
import './UserInfoPage.css'; 
import { Input, Button} from 'antd';
import { observer } from "mobx-react-lite";
import { userStore } from '../../userStore';



const generateAvatar = (username) => {
  const initials = username
    .split(' ')
    .map((name) => name[0].toUpperCase())
    .join('');
  return `https://ui-avatars.com/api/?name=${initials}&background=random&color=ffffff`;
};

const UserInfoPage = observer(() => {

  return (
    <div className="user-info-page">
      <div className="user-info-card">
        <img
          src={generateAvatar(userStore.username)}
          alt="User Avatar"
          className="user-avatar"
        />
        <h1 className="user-name">{userStore.fullName}</h1>
        <p className="user-detail">Ваш username: {userStore.username}</p>
        <p className="user-detail">
          Решено задач: {userStore.solvedTasks}
        </p>
      <Button type="primary" htmlType="submit" onClick={()=> userStore.logout()}>
        Выйти
      </Button>
      </div>
    </div>
  );
});

export default UserInfoPage;
