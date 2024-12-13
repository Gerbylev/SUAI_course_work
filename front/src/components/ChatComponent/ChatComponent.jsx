import React, { useState, useEffect } from 'react';
import { Button, Select, Input, Typography, Spin, message, Layout, Space, Avatar } from 'antd';
import { UserOutlined, RobotOutlined } from '@ant-design/icons';

const { Header, Content, Footer } = Layout;
const { Title, Text } = Typography;

const ChatComponent = ({ taskId }) => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState('');

  const apiUrl = `${process.env.REACT_APP_EVENTOS_PROXY}/api/solution/${taskId}`;

  useEffect(() => {
    const fetchChats = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/chat`, {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          },
        });

        if (!response.ok) throw new Error('Failed to load chats');
        const data = await response.json();
        // Map server response to the expected structure
        const formattedChats = data.map(chat => ({
          id: chat.id,
          summary: chat.summary || `Chat ${chat.id}`,
        }));
        setChats(formattedChats);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchChats();
  }, [apiUrl]);

  const createChat = async () => {
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

      if (!response.ok) throw new Error('Failed to create chat');
      const newChat = await response.json();
      setChats([...chats, {
        id: newChat.id,
        summary: newChat.summary || `Chat ${newChat.id}`,
      }]);
      message.success('Chat created');
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadChatMessages = async (chatId) => {
    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat/${chatId}`, {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
      });

      if (!response.ok) throw new Error('Failed to fetch chat history');
      const data = await response.json();
      // Map server messages to the expected structure
      const formattedMessages = data.messages.map(message => ({
        fromUser: message.role === 'user',
        text: message.content,
      }));
      setMessages(formattedMessages);
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const sendPrompt = async () => {
    if (!selectedChatId || !prompt.trim()) {
      message.error('Select a chat and enter a prompt');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${apiUrl}/chat/${selectedChatId}`, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) throw new Error('Failed to send prompt');
      const reply = await response.json();
      const updatedMessages = reply.messages.map(message => ({
        fromUser: message.role === 'user',
        text: message.content,
      }));
      setMessages(updatedMessages);
      setPrompt('');
    } catch (err) {
      message.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout style={{ height: 'calc(100vh - 186px)', backgroundColor: '#f0f2f5' }}>
      <Header style={{ backgroundColor: '#001529', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={3} style={{ color: '#fff', margin: 0 }}>Chat Manager</Title>
        <Button type="primary" onClick={createChat} disabled={loading}>Create Chat</Button>
      </Header>

      <Content style={{ display: 'flex', flexDirection: 'row', padding: 16 }}>
        <div style={{ width: '25%', paddingRight: 16 }}>
          <Select
            style={{ width: '100%' }}
            placeholder="Select a chat"
            onChange={(chatId) => {
              setSelectedChatId(chatId);
              loadChatMessages(chatId);
            }}
          >
            {chats.map(chat => (
              <Select.Option key={chat.id} value={chat.id}>
                {chat.summary}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', borderRadius: 8, padding: 16, overflow: 'hidden' }}>
          <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16 }}>
            {loading && <Spin tip="Loading..." />}
            {error && <Text type="danger">{error}</Text>}

            {messages.map((item, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: 8, alignItems: 'flex-start' }}>
                {item.fromUser ? (
                  <Avatar 
                    style={{ 
                      backgroundColor: '#1890ff', 
                      marginRight: 8, 
                      width: 40, 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 20 
                    }} 
                    icon={<UserOutlined />} 
                  />
                ) : (
                  <Avatar 
                    style={{ 
                      backgroundColor: '#f5222d', 
                      marginRight: 8, 
                      width: 40, 
                      height: 40, 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'center', 
                      fontSize: 20 
                    }} 
                    icon={<RobotOutlined />} 
                  />
                )}
                <div>
                  <Text strong>{item.fromUser ? 'You' : 'Bot'}</Text>
                  <div>{item.text}</div>
                </div>
              </div>
            ))}
          </div>

          {selectedChatId && (
            <Space.Compact style={{ display: 'flex', marginTop: 'auto' }}>
              <Input
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Type your message..."
                onPressEnter={sendPrompt}
              />
              <Button type="primary" onClick={sendPrompt} disabled={loading}>Send</Button>
            </Space.Compact>
          )}
        </div>
      </Content>

      {/* <Footer style={{ textAlign: 'center' }}>Chat Application ©2024</Footer> */}
    </Layout>
  );
};

export default ChatComponent;