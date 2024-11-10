import React from 'react';
import { Card } from 'antd';

const TasksPage = () => (
  <div className="tasks-page">
    {[1, 2, 3, 4, 5].map((task) => (
      <Card key={task} title={`Задание ${task}`} bordered className="task-card">
        Содержимое задания {task}
      </Card>
    ))}
  </div>
);

export default TasksPage;
