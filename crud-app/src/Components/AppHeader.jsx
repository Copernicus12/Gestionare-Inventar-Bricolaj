import React from 'react';
import { Layout, Typography, Input, Button } from 'antd';
import { AreaChartOutlined } from '@ant-design/icons';

const { Header } = Layout;

function AppHeader({ isLoggedIn, onLogout }) {
  return (
    <Header className="AppHeader" style={headerStyle}>
      <div style={logoContainerStyle}>
        <AreaChartOutlined style={logoIconStyle} />
        <Typography.Title style={titleStyle}>Inventory Management System</Typography.Title>
      </div>
      <div style={searchContainerStyle}>
        <Input.Search
          placeholder="Search..."
          allowClear
          enterButton
          style={{ width: '70%' }}
        />
      </div>
      <div style={buttonContainerStyle}>
        {isLoggedIn ? (
          <Button onClick={onLogout} type="primary">
            Logout
          </Button>
        ) : (
          <Button type="primary">
            <a href="/login">Login</a>
          </Button>
        )}
      </div>
    </Header>
  );
}

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: '0 20px',
  backgroundColor: '#fff',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
};

const logoContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

const logoIconStyle = {
  fontSize: '30px',
  marginLeft: '0px',
  color: 'black',
};

const titleStyle = {
  fontSize: '18px',
  marginLeft: '15px',
  marginBottom: '10px',
  color: 'black',
  lineHeight: 1,
};

const searchContainerStyle = {
  flex: 1,
  display: 'flex',
  justifyContent: 'left',
  padding: '0 40px',
};

const buttonContainerStyle = {
  display: 'flex',
  alignItems: 'center',
};

export default AppHeader;
