import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Modal, Typography, Divider } from 'antd';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { Title, Text } = Typography;

const TaskForm = () => {
    const { taskId } = useParams();
    const [form] = Form.useForm();

    const [taskData, setTaskData] = useState({
        title: "Задание 1",
        description: "## Описание задания в формате Markdown",
        status: "completed"
    });

    useEffect(() => {
        // Здесь мы уже используем хардкоженные данные, так что fetchTask не нужен
        form.setFieldsValue(taskData);
    }, [taskData, form]);

    const handleFinish = (values) => {
        // Обработка данных формы
        console.log("Задание:", values);
    };

    const onDelete = () =>{
        console.log('типо delet, ты чё вылупился, гуляй')
    }

    const handleDelete = () => {
        Modal.confirm({
            title: 'Вы уверены, что хотите удалить задание?',
            onOk: onDelete,
        });
    };

    return (
        <div style={{ padding: '20px' }}>
            <Title level={3}>{taskId ? 'Редактировать задание' : 'Создать новое задание'}</Title>
            <Form
                form={form}
                layout="vertical"
                onFinish={handleFinish}
                initialValues={{
                    status: 'pending',
                }}
            >
                <Form.Item
                    label="Название задания"
                    name="title"
                    rules={[{ required: true, message: 'Введите название задания' }]}
                >
                    <Input placeholder="Название задания" />
                </Form.Item>

                <Form.Item
                    label="Описание задания"
                    name="description"
                    rules={[{ required: true, message: 'Введите описание задания' }]}
                >
                    <TextArea rows={4} placeholder="Описание задания в формате Markdown" />
                </Form.Item>

                <Form.Item
                    label="Статус"
                    name="status"
                    rules={[{ required: true, message: 'Выберите статус' }]}
                >
                    <Select placeholder="Выберите статус">
                        <Option value="pending">В ожидании</Option>
                        <Option value="completed">Завершено</Option>
                    </Select>
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        {taskId ? 'Сохранить изменения' : 'Создать задание'}
                    </Button>
                    {taskId && (
                        <Button type="danger" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                            Удалить задание
                        </Button>
                    )}
                </Form.Item>
            </Form>
        </div>
    );
};

export default TaskForm;
