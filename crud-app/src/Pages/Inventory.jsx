import { Space, Table, Typography, Button, Modal, Form, Input, InputNumber, Select, Popconfirm } from "antd";
import { useEffect, useState } from "react";

function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:5000/products')
      .then((response) => response.json())
      .then((data) => {
        setDataSource(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  // Show modal for adding product
  const showAddModal = () => {
    setIsEdit(false);
    setCurrentProduct(null);
    setIsModalVisible(true);
  };

  // Show modal for editing product
  const showEditModal = (product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  // Handle form submit for adding or editing
  const handleFormSubmit = (values) => {
    if (isEdit) {
      // Update product (PATCH request)
      fetch(`http://localhost:5000/products/${currentProduct.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then((updatedProduct) => {
          setDataSource((prevData) =>
            prevData.map((product) =>
              product.id === updatedProduct.id ? updatedProduct : product
            )
          );
          setIsModalVisible(false);
        })
        .catch((error) => console.error("Error updating product:", error));
    } else {
      // Generate new product ID based on the highest existing ID
      const newId = Math.max(...dataSource.map((product) => product.id), 0) + 1;

      // Convert the ID to string
      const newProduct = { ...values, id: newId.toString() };

      // Add new product (POST request)
      fetch("http://localhost:5000/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct), // Send with new generated id as string
      })
        .then((response) => response.json())
        .then((newProduct) => {
          setDataSource((prevData) => [...prevData, newProduct]);
          setIsModalVisible(false);
        })
        .catch((error) => console.error("Error adding product:", error));
    }
  };

  // Handle modal cancel
  const handleCancel = () => {
    setIsModalVisible(false);
  };

  // Handle delete product
  const handleDelete = (id) => {
    fetch(`http://localhost:5000/products/${id}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (response.ok) {
          // Update the dataSource in the UI to reflect the removal
          setDataSource((prevData) => prevData.filter((product) => product.id !== id));
        } else {
          console.error("Error deleting product:", response.statusText);
        }
      })
      .catch((error) => {
        console.error("Error deleting product:", error);
      });
  };

  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Inventory</Typography.Title>
      <div>
        <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
          Add Product
        </Button>
      </div>
      <Table
        loading={loading}
        columns={[
          {
            title: "Title",
            dataIndex: "title",
          },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => <span>{value} lei</span>,
          },
          {
            title: "Stock",
            dataIndex: "stock",
          },
          {
            title: "Cod Culoare",
            dataIndex: "cod_culoare",
          },
          {
            title: "Season",
            dataIndex: "sezon",
          },
          {
            title: "Category",
            dataIndex: "category",
          },
          {
            title: "Department",
            dataIndex: "department",
          },
          {
            title: "Action",
            key: "action",
            align: "center", // Center align the Action column
            render: (text, record) => (
              <div>
                <Button type="link" onClick={() => showEditModal(record)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this product?"
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
          pageSize: 5, // Set maximum items per page to 5
        }}
        style={{
          borderRadius: "16px",
          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          overflow: "hidden",
          backgroundColor: "#fff",
        }}
      />

      {/* Modal for adding/editing product */}
      <Modal
        title={isEdit ? "Edit Product" : "Add Product"}
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        destroyOnClose
      >
        <Form
          initialValues={isEdit ? currentProduct : {}}
          onFinish={handleFormSubmit}
        >
          <Form.Item
            label="Title"
            name="title"
            rules={[{ required: true, message: "Please enter the product title" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Price"
            name="price"
            rules={[{ required: true, message: "Please enter the product price" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Stock"
            name="stock"
            rules={[{ required: true, message: "Please enter the stock quantity" }]}
          >
            <InputNumber min={0} />
          </Form.Item>
          <Form.Item
            label="Cod Culoare"
            name="cod_culoare"
            rules={[{ required: true, message: "Please enter the product color code" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Season"
            name="sezon"
            rules={[{ required: true, message: "Please enter the product season" }]}
          >
            <Select>
              <Select.Option value="Spring">Spring</Select.Option>
              <Select.Option value="Summer">Summer</Select.Option>
              <Select.Option value="Autumn">Autumn</Select.Option>
              <Select.Option value="Winter">Winter</Select.Option>
              <Select.Option value="All Year">All Year</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="Category"
            name="category"
            rules={[{ required: true, message: "Please enter the product category" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Department"
            name="department"
            rules={[{ required: true, message: "Please enter the product department" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              {isEdit ? "Update Product" : "Add Product"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Space>
  );
}

export default Inventory;
