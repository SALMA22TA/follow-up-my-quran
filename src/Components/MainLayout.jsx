import React from 'react';
import Navbar from './DashboardNavbar'; 

// @ts-ignore
const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '90px' }}>{children}</div> 
    </div>
  );
};

export default MainLayout;