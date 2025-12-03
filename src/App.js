import React, { useState, useRef, useEffect } from 'react';
import { Layout, theme, Button } from 'antd';
import { LoginOutlined, LogoutOutlined } from '@ant-design/icons';
import AppMenu from './Menu';
import Banner from './Banner';
import Announcement from './Announcement';
import ProgrammeHighlights from './ProgrammeHighlights';
import Thoughts from './Thoughts';
import Figures from './Figures';
import Officers from './Officers';
import VillageInfo from './VillageInfo';
import Progress from './Progress';
import Administration from './Administration';
import Gallery from './Gallery';
import Advertisement from './Advertisement';
import Schemes from './Schemes';
import Projects from './Projects';
import ProjectGallery from './ProjectGallery';
import Complaints from './Complaints';
import Donations from './Donations';
import ExpenditureCategories from './ExpenditureCategories';
import IncomeCategories from './IncomeCategories';
import IncomePeriods from './IncomePeriods';
import Title from 'antd/es/typography/Title';
import QuickLinks from './QuickLinks';
import FooterItems from './FooterItems';
import FooterCategories from './FooterCategories';
import BudgetSummary from './BudgetSummary';
import ExpenditurePeriods from './ExpenditurePeriods';
import Login from './Login';
import { isAuthenticated, clearAuth } from './services/axiosInstance';
import DigitalLibrary from './DigitalLibrary';
import TaxPayment from './TaxPayment';
const { Header, Content, Sider } = Layout;

const renderContent = (key) => {
  const components = {
    banner: <Banner />,
    announcement: <Announcement />,
    'programme-highlights': <ProgrammeHighlights />,
    thought: <Thoughts />,
    officers: <Officers />,
    'village-info': <VillageInfo />,
    progress: <Progress />,
    administration: <Administration />,
    gallery: <Gallery />,
    advertisement: <Advertisement />,
    schemes: <Schemes />,
    projects: <Projects />,
    'project-gallery': <ProjectGallery />,
    complaints: <Complaints />,
    donations: <Donations />,
    'expenditure-categories': <ExpenditureCategories />,
    'income-categories': <IncomeCategories />,
    'income-periods': <IncomePeriods />,
    'quick-links': <QuickLinks />,
    'important-figures': <Figures />,
    'administrative-members': <Administration />,
    'photo-gallery': <Gallery />,
    'footer-items': <FooterItems />,
    'footer-categories': <FooterCategories />,
    'budget-summary': <BudgetSummary />,
    'expenditure-periods': <ExpenditurePeriods />,     
    'digital-library': <DigitalLibrary />,
    'my-village': <VillageInfo />,
    'tax-payment': <TaxPayment />,
  };

  if (components[key]) {
    return components[key];
  }

  // const contentMap = {
  //   home: 'Home Page',
  //   announcement: 'Important Announcements',
  //   'important-figures': 'Important Figures',
  //   'administrative-members': 'Administrative Members',
  //   'my-village': 'My Village (Data Entry)',
  //   'quick-links': 'Quick Links',
  //   'photo-gallery': 'Photo Gallery',
  //   advertisement: 'Advertisement',
  //   'footer-links': 'Links & Footer',
  //   'gram-panchayat': 'Amchi Gram Panchayat',
  //   'village-history': 'Village History',
  //   'officers2': 'Officers (Data Entry)',
  // };
  return 'Select a menu item';
};

const App = () => {
  const [selectedKey, setSelectedKey] = useState('home');
  const [siderWidth, setSiderWidth] = useState(240);
  const [loggedIn, setLoggedIn] = useState(isAuthenticated());
  const siderRef = useRef(null);
  const isResizingRef = useRef(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLoginSuccess = () => {
    setLoggedIn(true);
  };

  const handleLogout = () => {
    clearAuth();
    setLoggedIn(false);
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (!isResizingRef.current) return;
      if (!siderRef.current) return;
      const rect = siderRef.current.getBoundingClientRect();
      const newWidth = Math.round(e.clientX - rect.left);
      const clamped = Math.max(140, Math.min(600, newWidth));
      setSiderWidth(clamped);
    };
    const onMouseUp = () => {
      isResizingRef.current = false;
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseup', onMouseUp);
    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  const onMouseDownResizer = (e) => {
    isResizingRef.current = true;
    // Prevent text selection while dragging
    document.body.style.userSelect = 'none';
  };

  // If not logged in, show the login page
  if (!loggedIn) {
    return <Login onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <Layout style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="demo-logo" style={{ display: 'flex', alignItems: 'center' }}>
          {/* indian flag or logo can be placed here */}
          <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="Indian Flag" style={{ height: '32px' }} />
         <Title level={3} style={{ color: 'white', marginLeft: '10px', display: 'inline-block', margin: 0 }}>GP Admin Panel</Title>
        </div>
        <Button 
          type="primary" 
          icon={<LogoutOutlined />}
          onClick={handleLogout}
          style={{
            background: 'transparent',
            borderColor: 'white',
            color: 'white',
          }}
        >
          Logout
        </Button>
      </Header>
      <Layout className='' style={{ display: 'flex', flex: 1 }}>
        <Sider
          ref={siderRef}
          width={siderWidth}
          style={{
            background: '#062233',
            backgroundColor: '#062233',
            height: 'auto',
            alignSelf: 'stretch',
            overflow: 'auto',
            position: 'relative',
          }}
        >
          <AppMenu onMenuClick={setSelectedKey} />
          {/* draggable resizer */}
          <div
            onMouseDown={onMouseDownResizer}
            style={{
              position: 'absolute',
              top: 0,
              right: -3,
              bottom: 0,
              width: 6,
              cursor: 'col-resize',
              zIndex: 20,
              background: colorBgContainer,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            aria-hidden
          >
            <div style={{ width: 2, height: '40%', background: 'rgba(0,0,0,0.15)', borderRadius: 2 }} />
          </div>
        </Sider>
        <Layout style={{ padding: '0 24px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>

          <Content
            style={{
              padding: 24,
              margin: 0,
              flex: 1,
              minHeight: 0,
              overflow: 'auto',
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            {renderContent(selectedKey)}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};
export default App;