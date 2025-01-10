import { Space, Table, Typography, Button, Modal, Form, Input, InputNumber, Select, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { jsPDF } from "jspdf";


function Inventory() {
  const [loading, setLoading] = useState(false);
  const [dataSource, setDataSource] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:1234/api/data/products') 
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

  // modal for adding product and product editing
  const showAddModal = () => {
    setIsEdit(false);
    setCurrentProduct(null);
    setIsModalVisible(true);
  };

  const showEditModal = (product) => {
    setIsEdit(true);
    setCurrentProduct(product);
    setIsModalVisible(true);
  };

  const handleFormSubmit = (values) => {
    if (isEdit) {
      fetch(`http://localhost:1234/api/data/products/${currentProduct._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      })
        .then((response) => response.json())
        .then(() => {
          fetchProducts();
          setIsModalVisible(false);
        })
        .catch((error) => console.error("Error updating product:", error));
    } else {
      const newId = (Math.max(...dataSource.map((product) => parseInt(product.id))) + 1).toString(); // Calculate new ID
      const newProduct = { ...values, id: newId };
  
      fetch("http://localhost:1234/api/data/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newProduct),
      })
        .then((response) => response.json())
        .then(() => {
          fetchProducts(); 
          setIsModalVisible(false);
        })
        .catch((error) => console.error("Error adding product:", error));
    }
  };
  
  const handleCancel = () => {
    setIsModalVisible(false);
  };

const handleDelete = (id) => {
  if (!id) {
    console.error("ID is undefined or invalid");
    return;
  }

  fetch(`http://localhost:1234/api/data/products/${id}`, {
    method: "DELETE",
  })
    .then((response) => {
      if (response.ok) {
        fetchProducts(); 
      } else {
        console.error("Error deleting product:", response.statusText);
      }
    })
    .catch((error) => {
      console.error("Error deleting product:", error);
    });
};

const fetchProducts = () => {
  setLoading(true);
  fetch('http://localhost:1234/api/data/products')
    .then((response) => response.json())
    .then((data) => {
      setDataSource(data);
      setLoading(false);
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
      setLoading(false);
    });
};

const exportToPDF = () => {
  const doc = new jsPDF('landscape');  
  doc.setFontSize(10); 
  doc.text("Product Inventory", 20, 20); 

  const headers = ["Title", "Price", "Stock", "Cod Culoare", "Season", "Category", "Department"];
  let yPosition = 30; 

  const columnPositions = {
    title: 20,
    price: 70,
    stock: 90,
    cod_culoare: 115,
    season: 150,
    category: 175,
    department: 220,
  };

  const columnWidths = {
    title: 40,
    price: 10,
    stock: 10,
    cod_culoare: 20,
    season: 10,
    category: 40,
    department: 20,
  };

  const removeDiacritics = (str) => {
    const diacriticsMap = {
      'ș': 's', 'Ș': 'S', 'ț': 't', 'Ț': 'T',
      'ă': 'a', 'Ă': 'A', 'â': 'a', 'Â': 'A',
      'î': 'i', 'Î': 'I',
    };
    return str.replace(/[șȘțȚăĂîÎâÂ]/g, match => diacriticsMap[match] || match);
  };

  headers.forEach((header, index) => {
    doc.setFontSize(12); 
    doc.text(header, columnPositions[Object.keys(columnPositions)[index]], yPosition);
  });

  yPosition += 10; 

  dataSource.forEach((product) => {
    const title = removeDiacritics(product.title);
    const price = removeDiacritics(String(product.price));
    const stock = removeDiacritics(String(product.stock));
    const codCuloare = removeDiacritics(String(product.cod_culoare));
    const season = removeDiacritics(String(product.sezon));
    const category = removeDiacritics(String(product.category));
    const department = removeDiacritics(String(product.department));

    const splitTitle = doc.splitTextToSize(title, columnWidths.title);

    doc.setFontSize(9); 
    doc.text(splitTitle, columnPositions.title, yPosition);
    doc.text(`${price} lei`, columnPositions.price, yPosition);
    doc.text(stock, columnPositions.stock, yPosition);
    doc.text(codCuloare, columnPositions.cod_culoare, yPosition);
    doc.text(season, columnPositions.season, yPosition);
    doc.text(category, columnPositions.category, yPosition);
    doc.text(department, columnPositions.department, yPosition);

    yPosition += 13; 

    if (yPosition > 190) { 
      doc.addPage();
      yPosition = 20; 

      headers.forEach((header, index) => {
        doc.setFontSize(12); 
        doc.text(header, columnPositions[Object.keys(columnPositions)[index]], yPosition);
      });
      yPosition += 10; 
    }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(`Page ${i} of ${pageCount}`,140, 205); 
    doc.text('Signature: _____________________', 225, 205); 
  }

  // Save the PDF
  doc.save("inventory.pdf");
};


  return (
    <Space size={20} direction="vertical" style={{ width: "100%" }}>
      <Typography.Title level={4}>Inventory</Typography.Title>
      <div>
        <Button type="primary" onClick={showAddModal} style={{ marginBottom: 16 }}>
          Add Product
        </Button>
        <Button type="default" onClick={exportToPDF} style={{ marginBottom: 16, marginLeft: 10 }}>
          Export to PDF
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
            align: "center", 
            render: (text, record) => (
              <div>
                <Button type="link" onClick={() => showEditModal(record)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Are you sure you want to delete this product?"
                  onConfirm={() => handleDelete(record._id)} 
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
            <Input />
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
