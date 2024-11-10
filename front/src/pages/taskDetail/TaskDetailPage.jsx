import React, {useState} from 'react';
import { Button, Upload, Typography, Tag, Divider, Modal, List } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import ReactMarkdown from 'react-markdown';
import { useNavigate, useParams } from 'react-router-dom';

const { Title, Text } = Typography;

const TaskDetailPage = () => {
    const navigate = useNavigate();
    const [isModalVisible, setIsModalVisible] = useState(false);
    const { taskId } = useParams();

    const task = {
        title: "Задание 1",
        createdBy: "Иван Иванов",
        status: "completed",
        description: `## Описание задания\n\nЗдесь находится текст задания в формате Markdown.`,
        owner: true,
    };

    const solutions = [
        { user: "Алексей", status: "completed", link: "https://github.com/alexey/solution" },
        { user: "Мария", status: "in_progress", link: "https://github.com/maria/solution" },
    ];

    const showModal = () => setIsModalVisible(true);
    const closeModal = () => setIsModalVisible(false);

    const handleFileUpload = ({ file }) => {
        console.log('Загруженный файл:', file);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', padding: '20px', boxSizing: 'border-box' }}>
            
            <div style={{ flex: 1, paddingRight: '20px', overflowY: 'auto' }}>
                <Title level={3}>{task.title}</Title>
                <Text type="secondary">Создано: {task.createdBy}</Text>
                <Divider />
                <Tag color={task.status === "completed" ? "green" : "red"}>
                    {task.status === "completed" ? "✓ Завершено" : "✗ В ожидании"}
                </Tag>
                <Divider />
                <ReactMarkdown>{task.description}</ReactMarkdown>
                {task.owner && (
                    <div style={{ marginTop: '20px' }}>
                        <Button type="primary" onClick={() => navigate(`/task-form/${taskId}`)}>
                            Редактировать задание
                        </Button>

                        <Button onClick={showModal} style={{ marginTop: '10px' }}>
                            Просмотреть решенные задачи
                        </Button>

                        <Modal
                            title="Решенные задачи"
                            visible={isModalVisible}
                            onCancel={closeModal}
                            footer={null}
                        >
                            <List
                                dataSource={solutions}
                                renderItem={(solution) => (
                                    <List.Item>
                                        <List.Item.Meta
                                            title={<a href={solution.link} target="_blank" rel="noopener noreferrer">{solution.user}</a>}
                                            description={`Статус: ${solution.status === "completed" ? "Завершено" : "В процессе"}`}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Modal>
                    </div>
                )}
            </div>

            
            <div style={{ flex: 1, paddingLeft: '20px', borderLeft: '1px solid #f0f0f0' }}>
                <Title level={4}>Загрузить решение</Title>
                <Text>Вы можете загрузить ссылку на GitHub или архив с решением:</Text>
                <Divider />

                
                <div style={{ marginBottom: '16px' }}>
                    <Text>Ссылка на GitHub:</Text>
                    <input
                        type="url"
                        placeholder="https://github.com/your-repo"
                        style={{
                            width: '100%',
                            padding: '8px',
                            marginTop: '8px',
                            border: '1px solid #d9d9d9',
                            borderRadius: '4px'
                        }}
                    />
                    <Button type="primary" style={{ marginTop: '8px' }}>Отправить ссылку</Button>
                </div>

                <Divider />

                
                <div>
                    <Text>Или загрузите zip-файл:</Text>
                    <Upload 
                        onChange={handleFileUpload} 
                        beforeUpload={() => false} 
                        accept=".zip"
                    >
                        <Button icon={<UploadOutlined />}>Загрузить zip-файл</Button>
                    </Upload>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailPage;
