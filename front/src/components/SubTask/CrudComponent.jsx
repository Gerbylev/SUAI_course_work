import React, { useState, useEffect } from 'react';
import { List, Button, Input, Modal, Form, message } from 'antd';

const CrudComponent = ({taskId}) => {
  const [items, setItems] = useState([]);
  const [newText, setNewText] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const apiUrl = process.env.REACT_APP_EVENTOS_PROXY + `/api/subtask/${taskId}`
  const fetchSubtasks = async () => {
    try {
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        message.error('Failed to fetch subtasks');
      }
    } catch (error) {
      message.error('An error occurred while fetching subtasks');
    }
  };

  const handleAdd = async () => {
    if (newText.trim()) {
      try {
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ text: newText }),
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
          setNewText('');
        } else {
          message.error('Failed to add subtask');
        }
      } catch (error) {
        message.error('An error occurred while adding subtask');
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(apiUrl + '?subtaskId=' + id, {
        method: 'DELETE',
        headers: {
          accept: 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setItems(data);
      } else {
        message.error('Failed to delete subtask');
      }
    } catch (error) {
      message.error('An error occurred while deleting subtask');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalVisible(true);
    form.setFieldsValue({ text: item.text });
  };

  const handleUpdate = async () => {
    try {
      form.validateFields().then(async ({ text }) => {
        const response = await fetch(apiUrl, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            accept: 'application/json',
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          body: JSON.stringify({ ...editingItem, text }),
        });
        if (response.ok) {
          const data = await response.json();
          setItems(data);
          setIsModalVisible(false);
          setEditingItem(null);
          form.resetFields();
        } else {
          message.error('Failed to update subtask');
        }
      });
    } catch (error) {
      message.error('An error occurred while updating subtask');
    }
  };

  useEffect(() => {
    const taskId = 1; // Example taskId, replace with actual taskId logic
    fetchSubtasks(taskId);
  }, []);

  return (
    <div style={{ maxWidth: 400, margin: '0 auto' }}>
      <Input
        placeholder="Enter new item"
        value={newText}
        onChange={(e) => setNewText(e.target.value)}
        onPressEnter={handleAdd}
        style={{ marginBottom: 16 }}
      />
      <Button type="primary" onClick={handleAdd} style={{ marginBottom: 16 }}>
        Add Item
      </Button>
      <List
        bordered
        dataSource={items}
        renderItem={(item) => (
          <List.Item
            actions={[
              <Button type="link" onClick={() => handleEdit(item)} key="edit">
                Edit
              </Button>,
              <Button
                type="link"
                danger
                onClick={() => handleDelete(item.id)}
                key="delete"
              >
                Delete
              </Button>,
            ]}
          >
            {item.text}
          </List.Item>
        )}
      />
      <Modal
        title="Edit Item"
        visible={isModalVisible}
        onOk={handleUpdate}
        onCancel={() => {
          setIsModalVisible(false);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="text"
            label="Text"
            rules={[{ required: true, message: 'Please enter text' }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CrudComponent;
