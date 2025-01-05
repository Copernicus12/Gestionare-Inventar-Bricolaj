import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Space,
  Typography,
  Modal,
  message,
  InputNumber,
} from "antd";

const API_URL_RFID = "http://localhost:1234/api/data/rfid"; 

const RFID = () => {
  const [rfidData, setRfidData] = useState([]);
  const [products, setProducts] = useState([]);
  const [lastRfidProducts, setLastRfidProducts] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isAddModalVisible, setIsAddModalVisible] = useState(false);
  const [currentRfidProducts, setCurrentRfidProducts] = useState([]);
  const [currentRfidDetails, setCurrentRfidDetails] = useState(null);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [newRfidDetails, setNewRfidDetails] = useState({
    scanDate: "",
    scannedBy: "",
    location: "",
  });

  // Fetch the RFID data
  const fetchRfidData = async () => {
    try {
      const response = await fetch(API_URL_RFID);
      const data = await response.json();
      setRfidData(data);

      if (data.length > 0) {
        const lastScan = data.reduce((latest, current) =>
          current.id > latest.id ? current : latest
        );
        setLastRfidProducts(lastScan.products || []);
      }
    } catch (error) {
      message.error("Failed to fetch RFID data.");
      console.error(error);
    }
  };

  // Fetch the products
  const fetchProducts = async () => {
    try {
      const response = await fetch(API_URL_PRODUCTS);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      message.error("Failed to fetch products.");
      console.error(error);
    }
  };

  // Extract and increment the last RFID ID
  const generateNewRfidId = () => {
    const lastRfid = rfidData
      .map((item) => item.id)
      .sort()
      .pop(); // Get the latest (max) RFID ID

    if (lastRfid) {
      // Extract the number part from "rfidX" format
      const lastRfidNumber = parseInt(lastRfid.replace("rfid", ""), 10);
      return `rfid${lastRfidNumber + 1}`; // Increment the number and return the new ID
    }
    return "rfid1"; // If no RFID exists, start from rfid1
  };

  // Initial fetch of RFID data and products
  useEffect(() => {
    fetchRfidData();
    fetchProducts();
  }, []);

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleAddCancel = () => {
    setIsAddModalVisible(false);
    setSelectedProducts({});
    setNewRfidDetails({
      scanDate: "",
      scannedBy: "",
      location: "",
    });
  };

  const handleViewProducts = (record) => {
    setCurrentRfidDetails(record);
    setCurrentRfidProducts(record.products);
    setIsModalVisible(true);
  };

  const handleAddRfid = () => {
    setIsAddModalVisible(true);
  };

  const handleAddRfidSubmit = async () => {
    const newRfidId = generateNewRfidId(); // Generate a new RFID ID
    const newRfidData = {
      id: newRfidId,  // New ID for the RFID entry
      ...newRfidDetails,
      products: Object.entries(selectedProducts).map(([id, { name, quantity }]) => ({
        id,
        name,
        quantity,
      })),
    };
  
    try {
      const response = await fetch(API_URL_RFID, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newRfidData),
      });
  
      if (response.ok) {
        message.success("RFID entry added successfully");
        fetchRfidData(); // Refresh the list of RFID data after adding a new entry
        handleAddCancel();
      } else {
        message.error("Failed to add RFID entry.");
      }
    } catch (error) {
      message.error("An error occurred while adding RFID data.");
      console.error(error);
    }
  };

  const handleProductSelection = (productId, name, quantity) => {
    setSelectedProducts((prevSelected) => {
      const updatedProducts = { ...prevSelected };

      if (quantity > 0) {
        updatedProducts[productId] = { name, quantity };
      } else {
        delete updatedProducts[productId];
      }

      return updatedProducts;
    });
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>RFID Scan Management</Typography.Title>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div style={{ width: "58%" }}>
          <Button
            type="primary"
            style={{
              marginBottom: 16,
              backgroundColor: "#4CAF50", // Green for success
              borderColor: "#4CAF50",
            }}
            onClick={() => setIsAddModalVisible(true)}
          >
            Add RFID Data
          </Button>

          <Table
            title={() => <Space>Last RFID Executed</Space>}
            columns={[
              {
                title: "RFID Scan Date",
                dataIndex: "scanDate",
              },
              {
                title: "Scanned By",
                dataIndex: "scannedBy",
              },
              {
                title: "Location",
                dataIndex: "location",
              },
              {
                title: "Action",
                key: "action",
                render: (_, record) => (
                  <Button type="link" onClick={() => handleViewProducts(record)}>
                    View Products
                  </Button>
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

        <div style={{ width: "38%" }}>
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
            dataSource={lastRfidProducts}
            pagination={{
              pageSize: 5,
            }}
            rowKey="id"
            style={{
              borderRadius: "16px",
              boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
              overflow: "hidden",
              backgroundColor: "#fff",
              marginTop: "47px", // Add margin top
            }}
          />
        </div>
      </div>

      <Modal
        title="Product Details from RFID Scan"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        {currentRfidDetails && (
          <>
            <p>
              <strong>RFID Scan ID:</strong> {currentRfidDetails.id}
            </p>
            <p>
              <strong>Scan Date:</strong> {currentRfidDetails.scanDate}
            </p>
            <p>
              <strong>Location:</strong> {currentRfidDetails.location}
            </p>
            <p>
              <strong>Products:</strong>
            </p>
            <ul>
              {currentRfidProducts.map((product) => (
                <li key={product.id}>
                  <strong>{product.name}</strong> (Quantity: {product.quantity})
                </li>
              ))}
            </ul>
          </>
        )}
      </Modal>

      <Modal
        title="Add RFID Data"
        visible={isAddModalVisible}
        onCancel={handleAddCancel}
        onOk={handleAddRfidSubmit}
      >
        <div>
          <div>
            <strong>Scan Date:</strong>
            <input
              type="datetime-local"
              value={newRfidDetails.scanDate}
              onChange={(e) =>
                setNewRfidDetails({ ...newRfidDetails, scanDate: e.target.value })
              }

              style={{
                marginLeft: "10px", 
                padding: "4px 8px", 
                borderRadius: "4px", 
              }}

            />
          </div>
          <div>
            <strong>Scanned By:</strong>
            <input
              type="text"
              value={newRfidDetails.scannedBy}
              onChange={(e) =>
                setNewRfidDetails({ ...newRfidDetails, scannedBy: e.target.value })
              }

              style={{
                marginLeft: "14px", 
                padding: "4px 8px",
                borderRadius: "4px", 
              }}

            />
          </div>
          <div>
            <strong>Location:</strong>
            <input
              type="text"
              value={newRfidDetails.location}
              onChange={(e) =>
                setNewRfidDetails({ ...newRfidDetails, location: e.target.value })
              }

               style={{
                marginLeft: "33px", 
                padding: "4px 8px",
                borderRadius: "4px", 
              }}

            />
          </div>
          <Table
            title={() => "Select Products"}
            columns={[
              {
                title: "Product ID",
                dataIndex: "id",
              },
              {
                title: "Product Name",
                dataIndex: "title",
              },
              {
                title: "Stock",
                dataIndex: "stock",
              },
              {
                title: "Quantity Found",
                render: (_, record) => (
                  <InputNumber
                    min={0}
                    onChange={(value) =>
                      handleProductSelection(record.id, record.title, value)
                    }
                  />
                ),
              },
            ]}
            dataSource={products}
            rowKey="id"
            pagination={{
              pageSize: 5,
            }}
          />
        </div>
      </Modal>
    </Space>
  );
};

export default RFID;
