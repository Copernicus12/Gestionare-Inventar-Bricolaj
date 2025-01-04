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

  // Fetch orders from the API
  useEffect(() => {
    setLoading(true);
    // Fetch orders data
    fetch("http://localhost:5000/orders")
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

  // Fetch products from the API to calculate total inventory products
  useEffect(() => {
    fetch("http://localhost:5000/products")
      .then((response) => response.json())
      .then((data) => {
        console.log("Products data:", data); // Verificăm datele returnate de API
        const totalInventory = data.reduce((acc, product) => {
          console.log("Product:", product); // Verificăm fiecare produs
          if (typeof product.stock === 'number') {
            acc += product.stock; // Asigurăm că stock este un număr valid
          } else {
            console.warn(`Invalid stock for product ${product.title}`);
          }
          return acc;
        }, 0);
        setInventoryProducts(totalInventory); // Actualizăm stocul total
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
        setInventoryProducts(0); // Dacă apare eroare, setăm inventarul la 0
      });
  }, []);
  

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
            value={incomingProducts || "Loading..."} // Display loading or actual value
          />
          <DashboardCard 
            icon={<DropboxOutlined style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Inventory Products" 
            value={inventoryProducts || "Loading..."} // Display total inventory products
          />
          <DashboardCard 
            icon={<UserOutlined style={{ color: 'purple', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Stock Managers" 
            value={5} 
          />
          <DashboardCard 
            icon={<EuroOutlined style={{ color: 'green', backgroundColor: 'rgba(0,255,0,0.25)', borderRadius: 20, fontSize: 24, padding: 8 }} />} 
            title="Stock Value" 
            value="5000 Lei" 
          />
        </Space>
      </Card>

      <Space direction="horizontal" size={20} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <RecentOrders />
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

// RecentOrders Component
function RecentOrders() {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/orders")
      .then(response => response.json())
      .then(data => {
        const recentOrders = data.slice(0, 5); // Fetch only the most recent 5 orders
        setOrders(recentOrders);
      })
      .catch(error => console.error("Error fetching orders:", error));
  }, []);

  return (
    <Card style={{ borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', padding: '20px', width: '100%' }}>
      <Typography.Text>Last Products Added From Inventory</Typography.Text>
      <Table
        columns={[
          { title: 'Title', dataIndex: 'title' },
          { title: 'Quantity', dataIndex: 'quantity' },
          { title: 'Price', dataIndex: 'discountedPrice' },
        ]}
        dataSource={orders}
        pagination={false}
        rowKey="id" // Assuming the API returns an "id" for each order
      />
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
      title: { display: true, text: 'Total Revenue per User' },
    },
  };

  return (
    <Card style={{ borderRadius: '15px', boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)', padding: '32px', width: '550px' }}>
      <Bar options={options} data={revenueData} />
    </Card>
  );
}

export default Dashboard;
