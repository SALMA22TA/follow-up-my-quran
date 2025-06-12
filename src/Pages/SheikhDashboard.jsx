import Sidebar from '../Components/Sidebar';
import Navbar from '../Components/DashboardNavbar';
import TodaysSessions from '../Components/TodaysSessions'

const Dashboard = () => {
  const dashboardContainer = {
    display: 'flex',
    flexDirection: 'row-reverse', // Sidebar on the right
    direction: 'rtl', // RTL alignment for Arabic
  };

  const mainContent = {
    marginRight: '220px', // Same as sidebar width
    padding: '20px',
    width: '100%',
    boxSizing: 'border-box',
  };

  return (
    <>
      <Navbar />
      <div 

      style={dashboardContainer}>
        <Sidebar />
        <div 

        style={mainContent}>
          <h1>لوحة تحكم الشيخ</h1>
        

<TodaysSessions />
          
        </div>

      </div>
    </>
  );
};


export default Dashboard;


