import React from 'react';
import Navbar from './DashboardNavbar'; 

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      <div style={{ marginTop: '90px' }}>{children}</div> 
    </div>
  );
};

export default MainLayout;