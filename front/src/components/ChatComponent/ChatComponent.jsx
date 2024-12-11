import React, { useState, useEffect } from 'react';
import { Button, List, Typography, Spin, message, Card, Select, Input, Space } from 'antd';

const { Title, Text } = Typography;

const ChatComponent = ({ taskId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChat, setSelectedChat] = useState(null); // Состояние для выбранного чата
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]); // Состояние для хранения сообщений чата

  const apiUrl = `${process.env.REACT_APP_EVENTOS_PROXY}/api/solution/${taskId}`;

  // Fetch chats when the component is mounted
  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/chat`, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) {
          throw new Error('Не удалось загрузить чаты');
        }

        const data = await response.json();
        setChats(data);
      } catch (err) {
        setError(err.message);
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [taskId]);

  // Create a new chat
  const handleCreateChat = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({}),
      });

      if (!response.ok) {
        throw new Error('Не удалось создать чат');
      }

      const data = await response.json();
      setChats([...chats, data]);
      message.success('Чат создан');
    } catch (err) {
      message.error('Не удалось создать чат');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch chat history
  const handleFetchHistory = async () => {
    if (!selectedChat) {
      message.error('Выберите чат');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat/${selectedChat}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error('Не удалось получить историю чата');
      }

      const data = await response.json();
      setMessages(data); // Сохраняем историю чата в состояние
      message.success('История чата получена');
    } catch (err) {
      message.error('Ошибка при получении истории чата');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Send prompt to the selected chat
  const handleSendPrompt = async () => {
    if (!selectedChat || !prompt) {
      message.error('Выберите чат и введите промпт');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat/${selectedChat}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        throw new Error('Не удалось отправить промпт');
      }

      const data = await response.json();
      setMessages([...messages, { text: prompt, fromUser: true }, { text: data.response, fromUser: false }]); // Добавляем новое сообщение
      setPrompt('');
      message.success('Промпт отправлен');
    } catch (err) {
      message.error('Ошибка при отправке промпта');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: 'auto', position: 'relative', height: '100vh' }}>
      <Title level={4}>Выберите чат или создайте новый</Title>

      {loading ? (
        <Spin tip="Загрузка чатов..." />
      ) : error ? (
        <Text type="danger" style={{ display: 'block' }}>{error}</Text>
      ) : chats.length === 0 ? (
        <Card
          title="Нет чатов"
          bordered={false}
          style={{ width: '100%' }}
        >
          <Button
            type="primary"
            onClick={handleCreateChat}
            style={{ marginBottom: '10px', width: "100%" }}
          >
            Создать новый чат
          </Button>
          <Text>Чатов нет. Хотите создать новый чат?</Text>
        </Card>
      ) : (
        <div>
          <Button
            type="primary"
            onClick={handleCreateChat}
            style={{ marginBottom: '10px', width: "100%" }}
          >
            Создать новый чат
          </Button>
          <Select
            placeholder="Выберите чат"
            style={{ width: '100%', marginBottom: '10px' }}
            onChange={setSelectedChat}
          >
            {chats.map(chat => (
              <Select.Option key={chat.id} value={chat.id}>
                {chat.summary || 'Без описания'}
              </Select.Option>
            ))}
          </Select>

          {selectedChat && (
            <>
              <Button
                type="primary"
                onClick={handleFetchHistory}
                style={{ marginTop: '10px', width: '100%' }}
              >
                Получить историю чата
              </Button>
              <div style={{ marginTop: '20px', maxHeight: 'calc(100vh - 200px)', overflowY: 'auto', paddingBottom: '50px' }}>
                <List
                  header={<div>История чата</div>}
                  bordered
                  dataSource={messages}
                  renderItem={message => (
                    <List.Item style={{ padding: '10px 20px' }}>
                      <Text>{message.fromUser ? `Вы: ${message.text}` : `Бот: ${message.text}`}</Text>
                    </List.Item>
                  )}
                />
              </div>
            </>
          )}

          {selectedChat && (
            <div style={{ position: 'absolute', bottom: '20px', width: '100%', padding: '0 20px' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Input
                  value={prompt}
                  onChange={e => setPrompt(e.target.value)}
                  placeholder="Введите промпт"
                  style={{ width: '100%' }}
                />
                <Button
                  type="primary"
                  onClick={handleSendPrompt}
                  style={{ width: '100%' }}
                >
                  Отправить промпт
                </Button>
              </Space>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatComponent;
