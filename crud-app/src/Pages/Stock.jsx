import React, { useState, useEffect } from "react";
import { Table, Button, Space, Typography, Popconfirm, Modal, Form, Input, message } from "antd";

const API_URL = "http://localhost:5000/employees"; // Replace with your API endpoint

const Stock = () => {
  const [employees, setEmployees] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isViewModalVisible, setIsViewModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEmployee, setCurrentEmployee] = useState(null);

  // Fetch employees from the backend
  const fetchEmployees = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setEmployees(data);
    } catch (error) {
      message.error("Failed to fetch employees.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // Show modal for adding an employee
  const showAddModal = () => {
    setIsEdit(false);
    setCurrentEmployee(null);
    setIsModalVisible(true);
  };

  // Show modal for editing an employee
  const showEditModal = (employee) => {
    setIsEdit(true);
    setCurrentEmployee(employee);
    setIsModalVisible(true);
  };

  // Show modal for viewing employee details
  const showViewModal = (employee) => {
    const defaultWorkSchedule = {
      Monday: "Not Set",
      Tuesday: "Not Set",
      Wednesday: "Not Set",
      Thursday: "Not Set",
      Friday: "Not Set",
      Saturday: "Not Set",
      Sunday: "Not Set",
    };

    setCurrentEmployee({
      ...employee,
      workSchedule: employee.workSchedule || defaultWorkSchedule,
      nextWorkDay: employee.nextWorkDay || "Not Set",
    });
    setIsViewModalVisible(true);
  };

  // Handle form submission for adding or editing an employee
  const handleFormSubmit = async (values) => {
    try {
      const employeeData = {
        ...values,
        nextWorkDay: "2025-01-06", // Default next work day
        workSchedule: {
          Monday: "00:00 - 08:00",
          Tuesday: "00:00 - 08:00",
          Wednesday: "00:00 - 08:00",
          Thursday: "00:00 - 08:00",
          Friday: "00:00 - 08:00",
          Saturday: "Off",
          Sunday: "Off",
        },
      };

      if (isEdit) {
        // Update employee
        const response = await fetch(`${API_URL}/${currentEmployee.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        });
        if (response.ok) {
          message.success("Employee updated successfully");
          fetchEmployees();
        } else {
          message.error("Failed to update employee.");
        }
      } else {
        // Add new employee
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(employeeData),
        });
        if (response.ok) {
          message.success("Employee added successfully");
          fetchEmployees();
        } else {
          message.error("Failed to add employee.");
        }
      }
    } catch (error) {
      message.error("An error occurred.");
      console.error(error);
    }
    setIsModalVisible(false);
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
    setIsViewModalVisible(false);
  };

  // Handle deleting an employee
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("Employee deleted successfully");
        fetchEmployees();
      } else {
        message.error("Failed to delete employee.");
      }
    } catch (error) {
      message.error("An error occurred while deleting.");
      console.error(error);
    }
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Employee Management</Typography.Title>
      <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
        Add Employee
      </Button>
      <Table
        columns={[
          {
            title: "Name",
            dataIndex: "name",
          },
          {
            title: "Position",
            dataIndex: "position",
          },
          {
            title: "Shift",
            dataIndex: "shift",
          },
          {
            title: "Action",
            key: "action",
            render: (text, record) => (
              <Space size="middle">
                <Button type="link" onClick={() => showViewModal(record)}>
                  View
                </Button>
                <Button type="link" onClick={() => showEditModal(record)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this employee?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]}
        dataSource={employees}
        pagination={{
          pageSize: 5,
        }}
        rowKey="id"
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      />
      {/* Add/Edit Modal */}
      <Modal
        title={isEdit ? "Edit Employee" : "Add Employee"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          initialValues={isEdit && currentEmployee ? currentEmployee : {}}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Name"
            name="name"
            rules={[{ required: true, message: "Please enter the employee name" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Position"
            name="position"
            rules={[{ required: true, message: "Please enter the position" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Shift"
            name="shift"
            rules={[{ required: true, message: "Please select the shift" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update Employee" : "Add Employee"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Employee Details"
        visible={isViewModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        {currentEmployee && (
          <div>
            <p>
              <strong>Name:</strong> {currentEmployee.name}
            </p>
            <p>
              <strong>Position:</strong> {currentEmployee.position}
            </p>
            <p>
              <strong>Shift:</strong> {currentEmployee.shift}
            </p>
            <p>
              <strong>Next Work Day:</strong> {currentEmployee.nextWorkDay}
            </p>
            <p>
              <strong>Work Schedule:</strong>
            </p>
            <ul>
              {Object.entries(currentEmployee.workSchedule).map(([day, hours]) => (
                <li key={day}>
                  <strong>{day}:</strong> {hours}
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default Stock;
