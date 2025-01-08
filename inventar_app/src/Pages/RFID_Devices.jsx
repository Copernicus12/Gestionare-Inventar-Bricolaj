import React, { useState, useEffect } from "react";
import { Table, Button, Space, Typography, Modal, message, Input, Popconfirm } from "antd";

const API_URL_RFID_DEVICES = "http://localhost:1234/api/data/rfid_devices";

const RFID_Devices = () => {
  const [rfidDevices, setRfidDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [newDeviceDetails, setNewDeviceDetails] = useState({
    id: "",
    name: "",
    imei_device: "",
    status: "",
    location: "",
    baterie: "",
    rfid_module: "",
  });
  const [isEditing, setIsEditing] = useState(false);

  // Fetch the RFID devices data
  const fetchRfidDevices = async () => {
    try {
      const response = await fetch(API_URL_RFID_DEVICES);
      if (!response.ok) {
        throw new Error("Failed to fetch RFID devices.");
      }
      const data = await response.json();
      setRfidDevices(data); // Set the fetched devices in state
    } catch (error) {
      message.error("Failed to fetch RFID devices.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRfidDevices(); // Fetch data when component mounts
  }, []);

  const handleViewDetails = (record) => {
    setSelectedDevice(record);
    setIsModalVisible(true);
  };

  const handleAddDevice = () => {
    setIsAddModalVisible(true);
    setIsEditing(false); // Set to false when adding new device
  };

  const handleAddDeviceSubmit = async () => {
    try {
      const response = await fetch(API_URL_RFID_DEVICES, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeviceDetails),
      });

      if (response.ok) {
        message.success("RFID Device added successfully!");
        fetchRfidDevices(); // Refresh the list of RFID devices
        setIsAddModalVisible(false); // Close the modal
        setNewDeviceDetails({
          id: "",
          name: "",
          imei_device: "",
          status: "",
          location: "",
          baterie: "",
          rfid_module: "",
        });
      } else {
        message.error("Failed to add RFID device.");
      }
    } catch (error) {
      message.error("An error occurred while adding the device.");
      console.error(error);
    }
  };

  const handleEditDevice = (device) => {
    setNewDeviceDetails(device);
    setIsAddModalVisible(true);
    setIsEditing(true); // Set to true when editing device
  };

  const handleUpdateDeviceSubmit = async () => {
    try {
      const response = await fetch(`${API_URL_RFID_DEVICES}/${newDeviceDetails.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newDeviceDetails),
      });

      if (response.ok) {
        message.success("RFID Device updated successfully!");
        fetchRfidDevices(); // Refresh the list of RFID devices
        setIsAddModalVisible(false); // Close the modal
        setNewDeviceDetails({
          id: "",
          name: "",
          imei_device: "",
          status: "",
          location: "",
          baterie: "",
          rfid_module: "",
        });
      } else {
        message.error("Failed to update RFID device.");
      }
    } catch (error) {
      message.error("An error occurred while updating the device.");
      console.error(error);
    }
  };

  const handleDeleteDevice = async (id) => {
    try {
      const response = await fetch(`${API_URL_RFID_DEVICES}/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        message.success("RFID Device deleted successfully!");
        fetchRfidDevices(); // Refresh the list of RFID devices
      } else {
        message.error("Failed to delete RFID device.");
      }
    } catch (error) {
      message.error("An error occurred while deleting the device.");
      console.error(error);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setIsAddModalVisible(false);
    setNewDeviceDetails({
      id: "",
      name: "",
      imei_device: "",
      status: "",
      location: "",
      baterie: "",
      rfid_module: "",
    });
  };

  // Function to get status color, background, and border style
  const getStatusStyle = (status) => {
    if (status === "active") {
      return {
        color: "black", // Text color
        backgroundColor: "green", // Background color for active
        border: "2px solid green", // Border color for active
        borderRadius: "50px", // Oval shape
        padding: "5px 15px", // Padding for space around text
      };
    } else if (status === "inactive") {
      return {
        color: "black", // Text color
        backgroundColor: "#A20102", // Background color for inactive
        borderRadius: "50px", // Oval shape
        padding: "5px 15px", // Padding for space around text
      };
    }
    return {};
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>RFID Devices Management</Typography.Title>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "100%" }}>
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#4CAF50", // Green color for success
              borderColor: "#4CAF50",
            }}
            onClick={handleAddDevice}
          >
            Add New Device
          </Button>

          <Table
  title={() => <Space>RFID Devices</Space>}
  columns={[
    {
      title: "Device ID",
      dataIndex: "id",  // Ar putea să fie 'device_002' sau altceva
      render: (text) => <span>{text}</span>, // Verifică că ai cheia corectă
    },
    {
      title: "Device Name",
      dataIndex: "nume", // Folosește cheia 'nume' dacă aceasta este corectă
    },
    {
      title: "IMEI Device",
      dataIndex: "imei_device",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => (
        <span style={getStatusStyle(status)}>{status}</span>
      ),
    },
    {
      title: "Battery",
      dataIndex: "baterie",
    },
    {
      title: "RFID Module",
      dataIndex: "rfid_module",
    },
    {
      title: <div style={{ textAlign: "center" }}>Action</div>,
      key: "action",
      render: (text, record) => (
        <Space>
          <Button type="link" onClick={() => handleViewDetails(record)}>
            View Details
          </Button>
          <Button
            type="link"
            onClick={() => handleEditDevice(record)}
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure to delete this device?"
            onConfirm={() => handleDeleteDevice(record.id)} // Asigură-te că folosești cheia corectă
          >
            <Button type="link" danger>
              Delete
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ]}
  dataSource={rfidDevices} // Aceasta va citi corect fiecare obiect
  pagination={{
    pageSize: 5,
  }}
  rowKey="id" // Verifică dacă ai cheia corectă
  style={{
    borderRadius: "16px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    backgroundColor: "#fff",
  }}
/>

        </div>
      </div>

      {/* Modal for viewing device details */}
      <Modal
        title="RFID Device Details"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        {selectedDevice && (
          <>
            <p>
              <strong>Device ID:</strong> {selectedDevice.id}
            </p>
            <p>
              <strong>Device Name:</strong> {selectedDevice.name}
            </p>
            <p>
              <strong>Status:</strong> {selectedDevice.status}
            </p>
            <p>
              <strong>Location:</strong> {selectedDevice.location}
            </p>
            <p>
              <strong>IMEI Device:</strong> {selectedDevice.imei_device}
            </p>
            <p>
              <strong>Battery:</strong> {selectedDevice.baterie}
            </p>
            <p>
              <strong>RFID Module:</strong> {selectedDevice.rfid_module}
            </p>
          </>
        )}
      </Modal>

      {/* Modal for adding or editing a device */}
      <Modal
        title={isEditing ? "Edit RFID Device" : "Add New RFID Device"}
        visible={isAddModalVisible}
        onCancel={handleCancel}
        onOk={isEditing ? handleUpdateDeviceSubmit : handleAddDeviceSubmit}
      >
        <div>
          <div>
            <strong>Device ID:</strong>
            <Input
              value={newDeviceDetails.id}
              onChange={(e) =>
                setNewDeviceDetails({ ...newDeviceDetails, id: e.target.value })
              }
              style={{ marginBottom: "10px" }}
              disabled={isEditing}
            />
          </div>
          <div>
            <strong>Device Name:</strong>
            <Input
              value={newDeviceDetails.name}
              onChange={(e) =>
                setNewDeviceDetails({ ...newDeviceDetails, name: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div>
            <strong>IMEI Device:</strong>
            <Input
              value={newDeviceDetails.imei_device}
              onChange={(e) =>
                setNewDeviceDetails({ ...newDeviceDetails, imei_device: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div>
            <strong>Status:</strong>
            <Input
              value={newDeviceDetails.status}
              onChange={(e) =>
                setNewDeviceDetails({ ...newDeviceDetails, status: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div>
            <strong>Battery:</strong>
            <Input
              value={newDeviceDetails.baterie}
              onChange={(e) =>
                setNewDeviceDetails({ ...newDeviceDetails, baterie: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
          </div>
          <div>
            <strong>RFID Module:</strong>
            <Input
              value={newDeviceDetails.rfid_module}
              onChange={(e) =>
                setNewDeviceDetails({ ...newDeviceDetails, rfid_module: e.target.value })
              }
              style={{ marginBottom: "10px" }}
            />
          </div>
        </div>
      </Modal>
    </Space>
  );
};

export default RFID_Devices;
