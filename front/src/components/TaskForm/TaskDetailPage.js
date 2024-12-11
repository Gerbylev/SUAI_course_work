import React, { useState } from 'react';
import { Button, Upload, Typography, Tag, Divider, Modal, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const TaskDetailPage = ({ taskData }) => {
    return (
        <div>
            <Title level={4}>{taskData.title || 'Название задачи отсутствует'}</Title>
            <Divider />
            <ReactMarkdown>{taskData.task || 'Описание задачи отсутствует'}</ReactMarkdown>
        </div>
    );
};

export default TaskDetailPage;
