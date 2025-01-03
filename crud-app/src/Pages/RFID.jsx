import React, { useState, useEffect } from "react";
import { Table, Button, Space, Typography, Popconfirm, Modal, message } from "antd";

const API_URL_RFID = "http://localhost:5000/rfid"; // API endpoint for RFID scans
const API_URL_PRODUCTS = "http://localhost:5000/products"; // API endpoint for products

const RFID = () => {
  const [rfidData, setRfidData] = useState([]); // Store RFID scan actions
  const [productData, setProductData] = useState([]); // Store product data from last RFID scan
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentRfid, setCurrentRfid] = useState(null);

  // Fetch the latest RFID actions
  const fetchRfidData = async () => {
    try {
      const response = await fetch(API_URL_RFID);
      const data = await response.json();
      setRfidData(data);
    } catch (error) {
      message.error("Failed to fetch RFID data.");
      console.error(error);
    }
  };

  // Fetch the products from the last RFID scan
  const fetchProductData = async () => {
    try {
      const response = await fetch(API_URL_PRODUCTS);
      const data = await response.json();
      setProductData(data);
    } catch (error) {
      message.error("Failed to fetch product data.");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchRfidData();
    fetchProductData();
  }, []);

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle deleting an RFID entry (for example)
  const handleDeleteRfid = async (id) => {
    try {
      const response = await fetch(`${API_URL_RFID}/${id}`, {
        method: "DELETE",
      });
      if (response.ok) {
        message.success("RFID entry deleted successfully");
        fetchRfidData();
      } else {
        message.error("Failed to delete RFID entry.");
      }
    } catch (error) {
      message.error("An error occurred while deleting.");
      console.error(error);
    }
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>RFID Scan Management</Typography.Title>

      {/* Container for both tables */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        {/* Table for Last RFID Scans */}
        <div style={{ width: "48%" }}>
          <Table
            title={() => "Last RFID Executed"}
            columns={[
              {
                title: "RFID Scan ID",
                dataIndex: "id",
              },
              {
                title: "Executed Time",
                dataIndex: "executedTime",
              },
              {
                title: "Action",
                key: "action",
                render: (text, record) => (
                  <Space size="middle">
                    <Button type="link" onClick={() => setCurrentRfid(record)}>
                      View Products
                    </Button>
                    <Popconfirm
                      title="Are you sure you want to delete this RFID scan?"
                      onConfirm={() => handleDeleteRfid(record.id)}
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
            dataSource={rfidData}
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
        </div>

        {/* Table for Products from Last RFID Scan */}
        <div style={{ width: "48%" }}>
          <Table
            title={() => "Products from Last RFID Scan"}
            columns={[
              {
                title: "Product ID",
                dataIndex: "id",
              },
              {
                title: "Product Name",
                dataIndex: "name",
              },
              {
                title: "Quantity",
                dataIndex: "quantity",
              },
            ]}
            dataSource={productData}
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
        </div>
      </div>

      {/* View Products Modal */}
      <Modal
        title="Product Details from RFID Scan"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        {currentRfid && (
          <div>
            <p>
              <strong>RFID Scan ID:</strong> {currentRfid.id}
            </p>
            <p>
              <strong>Executed Time:</strong> {currentRfid.executedTime}
            </p>
            <p>
              <strong>Products Scanned:</strong>
            </p>
            <ul>
              {currentRfid.products && currentRfid.products.map((product) => (
                <li key={product.id}>
                  <strong>{product.name}</strong> (Quantity: {product.quantity})
                </li>
              ))}
            </ul>
          </div>
        )}
      </Modal>
    </Space>
  );
};

export default RFID;
