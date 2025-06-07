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
      <Navbar /> {/* ✅ Navbar now spans the full width at the top */}
      <div 

      style={dashboardContainer}>
        <Sidebar />
        <div 

        style={mainContent}>
          <h1>لوحة التحكم</h1>
        

          {/* <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
  {[
    { title: 'عدد الطلاب', value: 12 },
    { title: 'السور المحفوظة', value: 5 },
    { title: 'الجلسات القادمة', value: 2 },
  ].map((card, index) => (
    <div
      key={index}
      style={{
        flex: '1',
        minWidth: '250px',
        padding: '20px',
        backgroundColor: '#D5E7E1',
        borderRadius: '12px',
        textAlign: 'center',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      }}
    >
      <h3 style={{ margin: '0 0 10px', color: '#1EC8A0' }}>{card.title}</h3>
      <p style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>{card.value}</p>
    </div>
  ))}
</div> */}

<TodaysSessions />
          
        </div>

      </div>
    </>
  );
};


export default Dashboard;


