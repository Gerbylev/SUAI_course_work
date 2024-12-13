import React, { useEffect, useState } from 'react';
import { Button, Upload, Typography, Tag, Divider, Modal, List, message, Input, Spin, Alert } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';
import TaskDetailPage from '../../components/TaskForm/TaskDetailPage';
import TaskForm from '../../components/TaskForm/TaskForm';
import ChatComponent from '../../components/ChatComponent/ChatComponent';
import CrudComponent from '../../components/SubTask/CrudComponent';

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
            <CrudComponent taskId={taskData.id}/>
            <Divider />
            <Button type="primary" onClick={() => console.log('View Task Submissions')}>Посмотреть выполненные задачи</Button>
            <Button type="link" onClick={()=>setIsOwnerView(!isOwnerView)}>Просмотреть задание</Button>
        </div>
    );
};

const statusColorMap = {
  ok: "green",
  error: "red",
  warning: "orange",
};

const RightPanel = ({ isChat, setIsChat, taskId }) => {
  const [loading, setLoading] = useState(false);
  const [comments, setComments] = useState([]);
  const [status, setStatus] = useState([])
  const [error, setError] = useState(null);
  const apiUrl = process.env.REACT_APP_EVENTOS_PROXY;

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      try {
        const response = await fetch(`${apiUrl}/api/solution/${taskId}`, {
          method: "GET",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Ошибка при получении данных: ${response.statusText}`);
        }

        const data = await response.json();
        setComments(data.comments || []);
        setStatus(data.status)
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchComments();
  }, [apiUrl, taskId]);

  const handleUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${apiUrl}/api/solution/${taskId}/file`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Ошибка при загрузке файла: ${response.statusText}`);
      }
      // const updatedComments = await response.json();
      // setComments(updatedComments.comments || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, alignItems: "center" }}>
      <div style={{ display: "flex", marginBottom: "20px" }}>
        <Button
          type={isChat ? "primary" : "text"}
          onClick={() => setIsChat(true)}
          style={{
            marginRight: "30px",
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
            textDecoration: isChat ? "underline" : "none",
            border: "none",
            background: "none",
          }}
        >
          Чат
        </Button>
        <Button
          type={!isChat ? "primary" : "text"}
          onClick={() => setIsChat(false)}
          style={{
            fontSize: "20px",
            fontWeight: "bold",
            color: "black",
            textDecoration: !isChat ? "underline" : "none",
            border: "none",
            background: "none",
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
        <div>
          <Text>Или загрузите zip-файл:</Text>
          <Upload
            beforeUpload={(file) => {
              handleUpload(file);
              return false;
            }}
            accept=".zip"
          >
            <Button icon={<UploadOutlined />} disabled={loading}>
              Загрузить zip-файл
            </Button>
          </Upload>
          <Divider />
          {loading && <Spin tip="Загрузка..." />}
          {error && <Alert message="Ошибка" description={error} type="error" showIcon />}
          {status && <Title>Статус задачи: {status}</Title>}
          {comments.length > 0 && (
            <div>
              <Text strong>Комментарии:</Text>
              <ul>
                {comments.map((comment, index) => (
                  <li key={index} style={{ marginBottom: "10px" }}>
                    <Tag
                      color={statusColorMap[comment.status] || "default"}
                      style={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        fontSize: "12px",
                      }}
                    >
                      {comment.status}
                    </Tag>{" "}
                    <Text>{comment.message}</Text>
                  </li>
                ))}
              </ul>
            </div>
          )}
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
