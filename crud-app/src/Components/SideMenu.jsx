import React, { useEffect, useState } from 'react';
import { Menu } from 'antd';
import { AppstoreOutlined, ShopOutlined, ShoppingCartOutlined, UserOutlined, ScanOutlined } from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

function SideMenu() {
  const location = useLocation();
  const [selectedKeys, setSelectedKeys] = useState('/');

  useEffect(() => {
    setSelectedKeys(location.pathname);
  }, [location.pathname]);

  const navigate = useNavigate();
  return (
    <div className="SideMenu">
      <Menu
        className="SideMenuVertical"
        style={{ paddingTop: 30 }}
        mode="vertical"
        onClick={(item) => navigate(item.key)}
        selectedKeys={[selectedKeys]}
        items={[
          {
            label: 'Dashboard',
            icon: <AppstoreOutlined />,
            key: '/',
          },
          {
            label: 'Inventory',
            icon: <ShopOutlined />,
            key: '/inventory',
          },
          {
            label: 'Orders',
            icon: <ShoppingCartOutlined />,
            key: '/orders',
          },
          {
            label: 'Stock',
            icon: <UserOutlined />,
            key: '/stock',
          },
          {
            label: 'RFID',
            icon: <ScanOutlined />,
            key: '/rfid',
          },
        ]}
      />
    </div>
  );
}

export default SideMenu;
