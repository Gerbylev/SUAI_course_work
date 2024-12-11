import React from 'react';
import { Input, Button} from 'antd';
import { UserOutlined, SearchOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../../assets/logo.png';
import './Topbar.scss';
import { useNavigate } from 'react-router-dom';

const Topbar = ({isLogin}) => {
  const navigate = useNavigate();

  const clickHandler = (isLogin) =>{
    if (isLogin){
      navigate(`/user`);
    }else{
      navigate(`/login`);
    }
    
  }

  return(
  <div className="topbar">
    <Link to="/" className="topbar-logo">
      <img src={logo} alt="Logo" />
    </Link>
    <Input
      placeholder="Поиск"
      prefix={<SearchOutlined />}
      className="topbar-search"
    />
    {isLogin ?     
    <div className="topbar-user">
      <UserOutlined onClick={()=> clickHandler(isLogin)}/>
    </div>
    :
    <div className="topbar-user">
      <Button type="primary" htmlType="submit" onClick={()=> clickHandler(isLogin)}>
        Войти
      </Button>
    </div>
    }
  </div>
)};

export default Topbar;
