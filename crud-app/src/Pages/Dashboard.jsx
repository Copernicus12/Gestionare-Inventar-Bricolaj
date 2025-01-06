import React, { useEffect, useState } from 'react';
import { Card, Space, Typography, Statistic, Table } from 'antd';
import { TruckFilled, DropboxOutlined, UserOutlined, EuroOutlined } from '@ant-design/icons';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Dashboard Component
function Dashboard() {
  const [incomingProducts, setIncomingProducts] = useState(0);
  const [inventoryProducts, setInventoryProducts] = useState(0); // New state for total inventory products
  const [loading, setLoading] = useState(true);
  const [stockManagers, setStockManagers] = useState(0); // New state for number of stock managers
  const [stockValue, setStockValue] = useState(0); // New state for stock value
  const [products, setProducts] = useState([]); // New state for product list

  const exchangeRate = 4.9; // 1 Euro = 4.9 Lei (cursul de schimb)

  // Fetch orders from the API
  useEffect(() => {
    setLoading(true);
    fetch("http://localhost:1234/api/data/orders")
      .then((response) => response.json())
      .then((data) => {
        const shippedAndPendingOrders = data.filter(order => 
          order.status === 'Shipped' || order.status === 'Pending'
        );
        const totalIncoming = shippedAndPendingOrders.reduce((acc, order) => acc + order.quantity, 0);
        setIncomingProducts(totalIncoming); // Update incoming products state
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
      });
  }, []);

  // Fetch products from the API to calculate total inventory products and stock value
  useEffect(() => {
    fetch("http://localhost:1234/api/data/products")
      .then((response) => response.json())
      .then((data) => {
        const totalInventory = data.reduce((acc, product) => {
          if (typeof product.stock === 'number') {
            acc += product.stock; // Ensure stock is a valid number
          } else {
            console.warn(`Invalid stock for product ${product.title}`);
          }
          return acc;
        }, 0);

        const totalValueInLei = data.reduce((acc, product) => {
          if (typeof product.stock === 'number' && typeof product.price === 'number') {
            acc += product.stock * product.price; // Use price instead of discountedPrice
          } else {
            console.warn(`Invalid stock or price for product ${product.title}`);
          }
          return acc;
        }, 0);

        const totalValueInEuro = totalValueInLei / exchangeRate; // Convert value from Lei to Euro

        setInventoryProducts(totalInventory); // Update total inventory products
        setStockValue(totalValueInEuro); // Update total stock value in Euro
        setProducts(data); // Save all products to state for the table
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setInventoryProducts(0); // Set inventory to 0 in case of error
        setStockValue(0); // Set stock value to 0 in case of error
      });
  }, []);

  // Fetch employees and calculate number of managers
  useEffect(() => {
    fetch("http://localhost:1234/api/data/employees")
      .then((response) => response.json())
      .then((data) => {
        const managerCount = data.filter(employee => employee.position === "Manager").length;
        setStockManagers(managerCount); // Set the count of managers
      })
      .catch((error) => {
        console.error("Error fetching employees:", error);
        setStockManagers(0); // If an error occurs, set managers count to 0
      });
  }, []);

  // Sorting products by stock in descending order
  const sortedProducts = products.sort((a, b) => b.id - a.id);

  // Table Columns for Inventory Products
  const columns = [
    { title: 'Title', dataIndex: 'title' },
    { title: 'Stock', dataIndex: 'stock' },
    { title: 'Price (Lei)', dataIndex: 'price' },
    { title: 'Color', dataIndex: 'cod_culoare' },
  ];

  return (
    <Space size={20} direction="vertical" style={{ width: '100%' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <svg fill="#000000" width="30px" height="30px" viewBox="0 0 495.398 495.398">
          <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z" />
          <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z" />
        </svg>
        <Typography.Title level={4} style={{ margin: 0, marginLeft: 10 }}>Dashboard</Typography.Title>
      </div>

      <Card style={{ borderRadius: '15px', boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)', padding: '1px' }}>
        <Space direction="horizontal" style={{ justifyContent: 'space-between', width: '100%' }}>
          <DashboardCard 
            icon={<TruckFilled style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Incoming Products" 
            value={incomingProducts || "Loading..."} 
          />
          <DashboardCard 
            icon={<DropboxOutlined style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Inventory Products" 
            value={inventoryProducts || "Loading..."} 
          />
          <DashboardCard 
            icon={<UserOutlined style={{ color: 'purple', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Stock Managers" 
            value={stockManagers || "Loading..."} // Display the calculated number of managers
          />
          <DashboardCard 
            icon={<EuroOutlined style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Stock Value" 
            value={stockValue ? `${stockValue.toFixed(2)} €` : "Loading..."} // Display stock value
          />
        </Space>
      </Card>

      <Space direction="horizontal" size={20} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Card title="Recent Products Added to Inventory" style={{ width: '100%', borderRadius: '15px' }}>
          <Table
            columns={columns}
            dataSource={sortedProducts.slice(0, 4)} // Show only the first 4 products, sorted by stock
            pagination={false}
            rowKey="id"
          />
        </Card>
        <DashboardChart />
      </Space>
    </Space>
  );
}

// DashboardCard Component
function DashboardCard({ title, value, icon }) {
  return (
    <Card style={{ width: '100%' }}>
      <Space direction="vertical" style={{ alignItems: 'center' }}>
        {icon}
        <Statistic title={title} value={value} />
      </Space>
    </Card>
  );
}

// DashboardChart Component
function DashboardChart() {
  const revenueData = {
    labels: ['User-1', 'User-2', 'User-3'],
    datasets: [
      {
        label: 'Revenue per User',
        data: [100, 200, 300],
        backgroundColor: 'rgb(16, 95, 0)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      title: {
        display: true,
        text: 'User Revenue',
      },
    },
  };

  return (
    <Card style={{ width: '50%' }}>
      <Bar data={revenueData} options={options} />
    </Card>
  );
}

export default Dashboard;
