import React, { useEffect, useState } from 'react';
import { Button, Upload, Typography, Tag, Divider, Modal, List, message, Input } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import TaskDetailPage from '../../components/TaskForm/TaskDetailPage';
import TaskForm from '../../components/TaskForm/TaskForm';
import ChatComponent from '../../components/ChatComponent/ChatComponent';

const { Title, Text } = Typography;

const LeftPanel = ({ taskData, isOwnerView, handleTaskChange, onSubmit, isOwner, setIsOwnerView }) => {
    const navigate = useNavigate();
    if (!isOwnerView) {
        return (
            <div style={{ flex: 1, paddingRight: '20px', overflowY: 'auto' }}>
                <TaskDetailPage taskData={taskData} />
                {isOwner && 
                    <>
                        <Button type="primary" onClick={() => console.log('View Task Submissions')}>Посмотреть выполненные задачи</Button>
                        <Button type="link" onClick={()=>setIsOwnerView(!isOwnerView)}>Редактировать задание</Button>
                    </>
                }    
            </div>    
            );
    }

    const onDelete = async () => {
        try {
            const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + `/api/task/${taskData.id}`
            const response = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`
                }
            });

            if (response.ok) {
                message.success('Задание удалено!');
                navigate('/')
            } else {
                message.error('Ошибка загрузки задачи: 404');
            }
        } catch (error) {
            message.error('Ошибка сети: не удалось загрузить данные.');
        }
    }

    return (
        <div style={{ flex: 1, paddingRight: '20px', overflowY: 'auto' }}>
            <TaskForm
                taskData={taskData}
                isNew={false}
                onTaskChange={handleTaskChange}
                onFinish={onSubmit}
                onDelete={onDelete}
            />
            <Divider />
            <Button type="primary" onClick={() => console.log('View Task Submissions')}>Посмотреть выполненные задачи</Button>
            <Button type="link" onClick={()=>setIsOwnerView(!isOwnerView)}>Просмотреть задание</Button>
        </div>
    );
};

const RightPanel = ({ isChat, setIsChat, taskId }) => {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', flex: 1, alignItems: 'center' }}>
        <div style={{ display: 'flex', marginBottom: '20px' }}>
          <Button
            type={isChat ? 'primary' : 'text'}
            onClick={() => setIsChat(true)}
            style={{
              marginRight: '30px',
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'black',
              textDecoration: isChat ? 'underline' : 'none',
              border: 'none',
              background: 'none',
            }}
          >
            Чат
          </Button>
          <Button
            type={!isChat ? 'primary' : 'text'}
            onClick={() => setIsChat(false)}
            style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: 'black',
              textDecoration: !isChat ? 'underline' : 'none',
              border: 'none',
              background: 'none',
            }}
          >
            Решение
          </Button>
        </div>
        <Divider />
        {isChat ? (
          <div>
            <ChatComponent taskId={taskId} />
          </div>
        ) : (
          <div style={{ padding: '20px' }}>
            <Title level={4}>Загрузить решение</Title>
            <Text>Вы можете загрузить ссылку на GitHub или архив с решением:</Text>
            <Divider />
            <div style={{ marginBottom: '16px' }}>
              <Text>Ссылка на GitHub:</Text>
              <Input
                type="url"
                placeholder="https://github.com/your-repo"
                style={{
                  width: '100%',
                  padding: '8px',
                  marginTop: '8px',
                  border: '1px solid #d9d9d9',
                  borderRadius: '4px',
                }}
              />
              <Button type="primary" style={{ marginTop: '8px' }}>
                Отправить ссылку
              </Button>
            </div>
            <Divider />
            <div>
              <Text>Или загрузите zip-файл:</Text>
              <Upload beforeUpload={() => false} accept=".zip">
                <Button icon={<UploadOutlined />}>Загрузить zip-файл</Button>
              </Upload>
            </div>
          </div>
        )}
      </div>
    );
  };

const TaskPage = () => {
    const navigate = useNavigate();
    const { taskId } = useParams();
    const [taskData, setTaskData] = useState(null);
    const [isOwnerView, setIsOwnerView] = useState(false);
    const [isOwner, setIsOwner] = useState(false);
    const [isChat, setIsChat] = useState(false);

    useEffect(() => {
        const fetchTaskData = async () => {
            try {
                const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + `/api/task/${taskId}`
                const response = await fetch(apiUrl, {
                    method: 'GET',
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('authToken')}`|| 'Default Value'
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    setTaskData(data);
                    setIsOwnerView(data.owner);
                    setIsOwner(data.owner)
                } else {
                    message.error('Ошибка загрузки задачи: 404');
                }
            } catch (error) {
                message.error('Ошибка сети: не удалось загрузить данные.');
            }
        };
        fetchTaskData();
    }, [taskId])

    if (!taskData) {
        return <div>Загрузка...</div>;
    }

    const onSubmit = async () =>{
        try {
            const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + `/api/task/${taskId}`
            const response = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    ...taskData
                })
            });

            if (response.ok) {
                const data = await response.json();
                setTaskData(data);
                setIsOwnerView(data.owner);
                setIsOwner(data.owner)
                message.success('Успешно обновлено!');
            } else {
                message.error('Ошибка загрузки задачи: 404');
            }
        } catch (error) {
            message.error('Ошибка сети: не удалось загрузить данные.');
        }

    }

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
            <LeftPanel 
                isOwner={isOwner}
                taskData={taskData} 
                isOwnerView={isOwnerView}
                setIsOwnerView={setIsOwnerView}
                handleTaskChange={(newData) => setTaskData(newData)}
                onSubmit={onSubmit}
            />
            <RightPanel isChat={isChat} setIsChat={setIsChat} taskId={taskId}/>
        </div>
    );
};

export default TaskPage;
