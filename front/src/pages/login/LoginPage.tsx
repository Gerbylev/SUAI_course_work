import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; // Подключение CSS для градиента
import { error } from 'console';
import { userStore } from '../../userStore';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    const { username, password } = values;
    const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + '/api/auth/login';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          password,
        }),
      });
  
      if (response.ok) {
        const data = await response.json();
        const token = data.token;
  
        localStorage.setItem('authToken', token);
        
        const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + '/api/account_info';

        const userInfoResponse = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });
  
        if (userInfoResponse.ok) {
          const userData = await userInfoResponse.json();
          
          userStore.login({
            username: userData.username,
            fullName: userData.full_name,
            solvedTasks: userData.solved_tasks,
            authToken: token,
          });
  
          message.success('Вход успешен!');
          navigate('/'); 
        } else {
          message.error('Не удалось получить данные пользователя');
        }
      } else {
        const errorData = await response.json();
        message.error(errorData.error_message || 'Ошибка регистрации');
      }
    } catch (error: any) {
      message.error(error.error_message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="login-page">
      <Form onFinish={handleLogin} layout="vertical" className="login-form">
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[{ required: true, message: 'Введите имя пользователя' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введите пароль' }]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Войти
          </Button>
        </Form.Item>
        <div className="register-link">
          Нет аккаунта? <a onClick={() => navigate('/register')}>Зарегистрироваться</a>
        </div>
      </Form>

    </div>
  );
};

export default LoginPage;