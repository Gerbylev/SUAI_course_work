import React, {useEffect, useState} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainLayout from './components/Layout/Layout';
import TasksPage from './pages/tasks/TasksPage';
import TaskDetailPage from './pages/TaskPage/TaskPage';
import TaskForm from './pages/taskForm/TaskForm';
import LoginPage from './pages/login/LoginPage';
import RegisterPage from './pages/registration/RegisterPage';
import UserInfoPage from './pages/user/UserInfoPage';
import { observer } from 'mobx-react';
import { userStore } from "./userStore";
import { Navigate } from "react-router-dom";
import TaskManagementPage from './pages/createTask/TaskManagementPage';

const App = () => {
  const [isLoad, setIsLoad] = useState(false)

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token && !userStore.isLogin) {
      const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + '/api/account_info';
      fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      })
        .then(response => response.json())
        .then(userData => {
          if (userData.username) {
            userStore.login({
              username: userData.username,
              fullName: userData.full_name,
              solvedTasks: userData.solved_tasks,
              authToken: token,
            });
          }
          setIsLoad(true)
        })
        .catch(error => {
          console.error("Ошибка при получении данных пользователя:", error);
          localStorage.removeItem('authToken');
          setIsLoad(true)
        })
        // .finally(setIsLoad(true))
    }else{
      setIsLoad(true)
    }
  }, []);

  return(
    <>
    {isLoad &&
      <Router>
      <Routes>
        <Route 
          path="/" 
          element={
            <ProtectedRoute requiresAuth={false}>
              <MainLayout><TasksPage /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/task/:taskId" 
          element={
            <ProtectedRoute requiresAuth={false}>
              <MainLayout><TaskDetailPage /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/create-task" 
          element={
            <ProtectedRoute requiresAuth={true}>
              <MainLayout><TaskManagementPage /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/task-form/:taskId" 
          element={
            <ProtectedRoute requiresAuth={false}>
              <MainLayout><TaskForm /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/task-form" 
          element={
            <ProtectedRoute requiresAuth={false}>
              <MainLayout><TaskForm /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user" 
          element={
            <ProtectedRoute requiresAuth={true}>
              <MainLayout><UserInfoPage /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/register" 
          element={
            <ProtectedRoute requiresAuth={false}>
              <MainLayout hasSidebar={false}><RegisterPage /></MainLayout>
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/login" 
          element={
            <ProtectedRoute requiresAuth={false}>
              <MainLayout hasSidebar={false}><LoginPage /></MainLayout>
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
    }
    </>
  
)};

const ProtectedRoute = observer(({ children, requiresAuth }) => {
  if (requiresAuth && !userStore.isLogin) {
    return <Navigate to="/login" replace />;
  }

  return children;
});

export default App;