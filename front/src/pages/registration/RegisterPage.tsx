import React from 'react';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import './RegisterPage.css'; 

const RegisterPage = () => {
  const navigate = useNavigate();
  const handleRegister = async (values: { username: string; password: string; full_name: string }) => {
    const { username, password, full_name } = values;

    const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + '/api/auth/register';
    
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          full_name,
          username,
          password,
        }),
      });

      if (response.ok) {
        message.success('Регистрация успешна!');
        navigate('/login');  
      } else {
        const errorData = await response.json();
        message.error(errorData.error_message || 'Ошибка регистрации');
      }
    } catch (error: any) {
      message.error(error.error_message || 'Ошибка регистрации');
    }
  };

  return (
    <div className="register-page">
      <Form onFinish={handleRegister} layout="vertical" className="register-form">
        <Form.Item
          label="Имя пользователя"
          name="username"
          rules={[{ required: true, message: 'Введите имя пользователя' }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Отображаемое имя"
          name="full_name"
          rules={[{ required: true, message: 'Введите имя которое может увидеть каждый' }]}
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
            Зарегистрироваться
          </Button>
        </Form.Item>
        <div className="register-link">
          Есть аккаунт? <a onClick={() => navigate('/login')}>Войти</a>
        </div>
      </Form>
    </div>
  );
};

export default RegisterPage;