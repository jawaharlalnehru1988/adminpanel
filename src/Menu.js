import { Menu } from "antd";
import {
  HomeOutlined,
  UserOutlined,
  FileImageOutlined,
  LinkOutlined,
  TeamOutlined,
  HistoryOutlined,
  FileTextOutlined,
  BgColorsOutlined,
} from "@ant-design/icons";

const items = [
  
  {
    key: "home",
    icon: <HomeOutlined />,
    label: "Home Page",
    children: [
        {
    key: "banner",
    icon: <BgColorsOutlined />,
    label: "Banner Management",
  },
      { key: "announcement", label: "Important Announcements" },
      { key: "programme-highlights", label: "Programme Highlights" },
      { key: "progress", label: "Progress / Projects" },
      { key: "projects", label: "Projects / Ongoing Works" },
      { key: "complaints", label: "Complaints" },
      { key: "donations", label: "Donations" },
      { key: "expenditure-categories", label: "Expenditure Categories" },
      { key: "income-categories", label: "Income Categories" },
      { key: "income-periods", label: "Income Periods" },
      { key: "figures", label: "Figures / Key Numbers" },
      { key: "thought", icon: <FileTextOutlined />, label: "Thoughts" },
      { key: "important-numbers", label: "Important Numbers (Data Entry)" },
      { key: "govt", label: "Government of Maharashtra" },
      { key: "officers", icon: <UserOutlined />, label: "Office Bearers (Data Entry)" },
      { key: "my-village", label: "My Village (Data Entry)" },
      { key: "quick-links", icon: <LinkOutlined />, label: "Quick Links" },
      { key: "photo-gallery", icon: <FileImageOutlined />, label: "Photo Gallery (Data Entry)" },
      { key: "gallery", icon: <FileImageOutlined />, label: "Gallery" },
      { key: "advertisement", label: "Advertisement" },
      { key: "project-gallery", label: "Project Gallery" },
      { key: "schemes", label: "Schemes / Government Programs" },
      { key: "footer-links", label: "Links & Footer" },
    ],
  },
  {
    key: "gram-panchayat",
    icon: <TeamOutlined />,
    label: "Amchi Gram Panchayat",
    children: [
    
      {
        key: "village-info",
        icon: <HistoryOutlined />,
        label: "Village History (Data Entry)",
      },
      {
        key: "administration",
        icon: <UserOutlined />,
        label: "Administration",
      },
      {
        key: "officers2",
        icon: <UserOutlined />,
        label: "Officers (Data Entry)",
      },
    ],
  },
];

export default function AppMenu({ onMenuClick }) {
  return <Menu mode="inline" theme="dark" items={items} onClick={(e) => onMenuClick(e.key)} />;
}
