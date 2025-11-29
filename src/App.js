import React, { useState } from 'react';
import { Layout, theme } from 'antd';
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
const { Header, Content, Sider } = Layout;

const renderContent = (key) => {
  const components = {
    banner: <Banner />,
    announcement: <Announcement />,
    'programme-highlights': <ProgrammeHighlights />,
    thought: <Thoughts />,
    figures: <Figures />,
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
  };

  if (components[key]) {
    return components[key];
  }

  const contentMap = {
    home: 'Home Page',
    announcement: 'Important Announcements',
    'important-numbers': 'Important Numbers (Data Entry)',
    govt: 'Government of Maharashtra',
    officers: 'Office Bearers (Data Entry)',
    'my-village': 'My Village (Data Entry)',
    'quick-links': 'Quick Links',
    'photo-gallery': 'Photo Gallery (Data Entry)',
    advertisement: 'Advertisement',
    'footer-links': 'Links & Footer',
    'gram-panchayat': 'Amchi Gram Panchayat',
    'village-history': 'Village History (Data Entry)',
    'officers2': 'Officers (Data Entry)',
  };
  return contentMap[key] || 'Select a menu item';
};

const App = () => {
  const [selectedKey, setSelectedKey] = useState('home');
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  return (
    <Layout>
      <Header >
        <div className="demo-logo" >
          {/* indian flag or logo can be placed here */}
          <img src="https://upload.wikimedia.org/wikipedia/en/4/41/Flag_of_India.svg" alt="Indian Flag" style={{ height: '32px' }} />
         <Title level={3} style={{ color: 'white', marginLeft: '10px', display: 'inline-block' }}>GP Admin Panel</Title>
        </div>
      </Header>
      <Layout>
        <Sider style={{ background: colorBgContainer }}>
          <AppMenu onMenuClick={setSelectedKey} />
        </Sider>
        <Layout style={{ padding: '0 24px 24px' }}>
        
          <Content
            style={{
              padding: 24,
              margin: 0,
              minHeight: 280,
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