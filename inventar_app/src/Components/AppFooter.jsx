import React from 'react';
import { Layout, Typography } from 'antd';

const { Footer } = Layout;

function AppFooter() {
  return (
    <Footer style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: '10px 10px', backgroundColor: '#fff', borderTop: '1px solid #000' }}>
      <Typography.Link href="" target="_blank" style={{ marginRight: '70px' }}>
        Privacy Policy
      </Typography.Link>
      <Typography.Link href="" target="_blank">
        Terms of Use
      </Typography.Link>
    </Footer>
  );
}

export default AppFooter;