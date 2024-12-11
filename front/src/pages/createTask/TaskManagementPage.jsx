import React, {useState} from 'react';
import { Typography, Divider } from 'antd';
import TaskForm from '../../components/TaskForm/TaskForm';
import TaskDetailPage from '../../components/TaskForm/TaskDetailPage';
import { Form, Input, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';

const { Title } = Typography;

const TaskManagementPage = () => {
    const navigate = useNavigate();
    const [taskData, setTaskData] = useState({
        title: '',
        task: ''
    });

    const handleTaskChange = (updatedTaskData) => {
        setTaskData(updatedTaskData);
    };

    const onSubmit = async ()=>{
        const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + '/api/task';
    
        try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('authToken')}`
            },
            body: JSON.stringify({
            ...taskData
            }),
        });
    
        if (response.ok) {
            const data = await response.json();
            const task_id = data.id;
            message.success('Задача создана!');
            navigate(`/task/${task_id}`); 
        } else {
            const errorData = await response.json();
            message.error(errorData.error_message || 'Ошибка ');
        }
        } catch (error) {
            message.error(error.error_message || 'Ошибка');
        }

    }

    return (
        <div style={{ display: 'flex', height: '100vh', boxSizing: 'border-box' }}>
            
            <div style={{ flex: 1, padding: '20px', overflowY: 'auto' }}>
                <Title level={3}>Создать Задачу</Title>
                <Divider />
                <TaskForm
                    taskData={taskData}
                    isNew={true}
                    onTaskChange={handleTaskChange}
                    onFinish={onSubmit}
                />
            </div>

            <div style={{ flex: 1, padding: '20px', borderLeft: '1px solid #f0f0f0', overflowY: 'auto' }}>
                <Title level={3}>Просмотр Задачи</Title>
                <Divider />
                <TaskDetailPage taskData={taskData}/>
            </div>
        </div>
    );
};

export default TaskManagementPage;
