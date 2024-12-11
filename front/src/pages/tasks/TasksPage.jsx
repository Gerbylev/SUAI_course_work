import React, { useState, useEffect } from 'react';
import { Card, Pagination, Tag, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import './TasksPage.css';
import { observer } from "mobx-react-lite";
import { userStore } from '../../userStore';

const cleanMarkdown = (text) => {
  return text.replace(/[#_*~`>[\]()\-]/g, '');
};

const TasksPage = observer(() => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + `/api/tasks`
        const response = await fetch(apiUrl, {
          headers: {
            'accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setTasks(Array.isArray(data) ? data : [data]); 
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const getStatusTag = (status) => {
    switch (status) {
      case 'Решено':
        return <Tag color="green">Решена</Tag>;
      case 'Не решено':
        return <Tag color="red">Не решено</Tag>;
      default:
        return <Tag>Неизвестно</Tag>;
    }
  };

  const handleCardClick = (id) => {
    navigate(`/task/${id}`);
  };

  const paginatedTasks = tasks.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="tasks-page">
      <div className="tasks-header">
        {userStore.isLogin && 
          <div className="button-column">
            <Button 
                onClick={() => navigate('/create-task')} 
                className="create-task-button"
            >
                Создать задачу
            </Button>
          </div>
        }
      </div>
      <div className="tasks-container">
        {paginatedTasks.map((task) => (
          <Card
            key={task.id}
            title={task.title}
            bordered
            hoverable
            className="task-card"
            onClick={() => handleCardClick(task.id)}
          >
            <div className="task-content">
              <p>{cleanMarkdown(task.task).slice(0, 200)}{task.task.length > 200 ? '...' : ''}</p>
              <div className="task-meta">
                <span className="task-author">Автор: {task.author}</span>
                {getStatusTag(task.solved)}
              </div>
            </div>
          </Card>
        ))}
      </div>
      <Pagination
        current={currentPage}
        total={tasks.length}
        pageSize={pageSize}
        onChange={(page, size) => {
          setCurrentPage(page);
          setPageSize(size);
        }}
        showSizeChanger
        pageSizeOptions={[5, 10, 20, 50]}
        className="tasks-pagination"
      />
    </div>
  );
});

export default TasksPage;