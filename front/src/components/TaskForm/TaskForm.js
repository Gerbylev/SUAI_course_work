import React, { useState, useEffect } from 'react';
import { Form, Input, Button, Select, Modal, Typography } from 'antd';
import { useParams } from 'react-router-dom';

const { TextArea } = Input;
const { Option } = Select;
const { Title } = Typography;

const TaskForm = ({ taskData, isNew, onTaskChange, onFinish, onDelete }) => {
    const [form] = Form.useForm();
    
    const handleFieldChange = (_, allFields) => {
        const updatedTaskData = allFields.reduce((acc, field) => {
            acc[field.name[0]] = field.value;
            return acc;
        }, {});
        onTaskChange(updatedTaskData);
    };

    React.useEffect(() => {
        form.setFieldsValue(taskData);
    }, [taskData, form]);

    const handleDelete = () => {
        Modal.confirm({
            title: 'Вы уверены, что хотите удалить задание?',
            onOk: onDelete,
        });
    };

    return (
        <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            onFieldsChange={handleFieldChange}
            initialValues={taskData}
        >
            <Form.Item
                label="Название задачи"
                name="title"
                rules={[{ required: true, message: 'Введите название задачи' }]}
            >
                <Input placeholder="Название задачи" />
            </Form.Item>

            <Form.Item
                label="Описание задачи"
                name="task"
                rules={[{ required: true, message: 'Введите описание задачи' }]}
            >
                <TextArea rows={4} placeholder="Описание задачи" />
            </Form.Item>


            <Form.Item>
                <Button type="primary" htmlType="submit">
                    {isNew ? 'Создать задачу' : 'Сохранить изменения'}
                </Button>
                {!isNew && 
                    <Button type="link" onClick={handleDelete} style={{ marginLeft: '10px' }}>
                        {'Удалить задачу'}
                    </Button>
                }
            </Form.Item>
        </Form>
    );
};

export default TaskForm;