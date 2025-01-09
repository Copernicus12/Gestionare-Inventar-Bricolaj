import { Space, Table, Typography, Button, Modal, Form, Input, InputNumber, Select, Popconfirm, DatePicker } from "antd";
import { useEffect, useState } from "react";

function Orders() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [products, setProducts] = useState([]);

  // Fetch products to display in the Select dropdown for the order form
  useEffect(() => {
    fetch("http://localhost:1234/api/data/products")
      .then((response) => response.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error("Error fetching products:", error));
  }, []);

  // Fetch orders data
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:1234/api/data/orders")
      .then((response) => response.json())
      .then((data) => {
        setDataSource(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  const showAddModal = () => {
    setIsModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    const orderData = {
      ...values,
      orderDate: values.orderDate.format("YYYY-MM-DD"), 
      deliveryDate: values.deliveryDate ? values.deliveryDate.format("YYYY-MM-DD") : null, // delivery date
    };

    fetch("http://localhost:1234/api/data/orders", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(orderData),
    })
      .then((response) => response.json())
      .then((newOrder) => {
        setDataSource((prevData) => [...prevData, newOrder]);
        setIsModalVisible(false);
      })
      .catch((error) => console.error("Error adding order:", error));
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleDelete = (id) => {
    fetch(`http://localhost:1234/api/data/orders/${id}`, {
      method: "DELETE",
    })
      .then(() => {
        setDataSource((prevData) => prevData.filter((order) => order.id !== id));
      })
      .catch((error) => console.error("Error deleting order:", error));
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Orders</Typography.Title>
      <div>
        <Button
          type="primary"
          onClick={showAddModal}
          style={{
            marginBottom: 16,
            backgroundColor: '#4CAF50',
            borderColor: '#4CAF50',
            borderRadius: '8px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          }}
        >
          Add Order / Restock
        </Button>
      </div>
      <Table
        loading={loading}
        columns={[
          {
            title: "Order ID",
            dataIndex: "id",
          },
          {
            title: "Product",
            dataIndex: "productId",
            render: (value) => {
              const product = products.find((product) => product.id === value);
              return product ? product.title : "Product not found";
            },
          },
          {
            title: "Quantity",
            dataIndex: "quantity",
          },
          {
            title: "Status",
            dataIndex: "status",
          },
          {
            title: "Order Date",
            dataIndex: "orderDate",
          },
          {
            title: "Delivery Date",
            dataIndex: "deliveryDate",
          },
          {
            title: "Action",
            key: "action",
            render: (text, record) => (
              <div>
                <Popconfirm
                  title="Are you sure you want to delete this order?"
                  onConfirm={() => handleDelete(record.id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </div>
            ),
          },
        ]}
        dataSource={dataSource}
        pagination={{
          pageSize: 5,
        }}
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      />

      {/* Modal for adding order */}
      <Modal
        title="Add Order"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form onFinish={handleFormSubmit}>
          <Form.Item
            label="Product"
            name="productId"
            rules={[{ required: true, message: "Please select a product" }]}
          >
            <Select>
              {products.map((product) => (
                <Select.Option key={product.id} value={product.id}>
                  {product.title}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Quantity"
            name="quantity"
            rules={[{ required: true, message: "Please enter the quantity" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Please select the order status" }]}
          >
            <Select>
              <Select.Option value="Pending">Pending</Select.Option>
              <Select.Option value="Shipped">Shipped</Select.Option>
              <Select.Option value="Delivered">Delivered</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Order Date"
            name="orderDate"
            rules={[{ required: true, message: "Please select the order date" }]}
          >
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item label="Delivery Date" name="deliveryDate">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Add Order
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default Orders;
