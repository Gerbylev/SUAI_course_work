import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/Layout/Layout';
import TasksPage from './pages/tasks/TasksPage';
import TaskDetailPage from './pages/taskDetail/TaskDetailPage';
import TaskForm from './pages/taskForm/TaskForm';

const App = () => (
  <Router>
    <MainLayout>
      <Routes>
      <Route path="/" element={<TasksPage />} />
      <Route path="/task/:taskId" element={<TaskDetailPage />} />
      <Route path="/task-form/:taskId" element={<TaskForm />} />
      <Route path="/task-form" element={<TaskForm />} />
      </Routes>
    </MainLayout>
  </Router>
);

export default App;