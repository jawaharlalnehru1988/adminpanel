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
    key: "divider1",
    type: "divider",
    label: "मुख्य पृष्ठ",
    children: [
      { key: "banner", label: "Banner Management" },
      { key: "announcement", label: "Important Announcements" },
      { key: "programme-highlights", label: "Programme Highlights" },
      { key: "thought", label: "Thoughts" },
      { key: "important-numbers", label: "Important Numbers (Data Entry)" },
      { key: "progress", label: "प्रगती मीटर" },
      { key: "govt", label: "Government of Maharashtra" },
      {
        key: "officers",
        label: "Office Bearers (Data Entry)",
      },
      { key: "quick-links", icon: <LinkOutlined />, label: "Quick Links" },
      {
        key: "photo-gallery",
        icon: <FileImageOutlined />,
        label: "Photo Gallery (Data Entry)",
      },
      { key: "advertisement", label: "Advertisement" },
      { key: "footer-links", label: "Links & Footer" },
    ],
  },
  {
    key: "divider2",
    type: "divider",
    label: "आमची ग्रामपंचायत",
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
  {
    key: "divider3",
    type: "divider",
    label: "आपले गाव",
    children: [{ key: "my-village", label: "My Village (Data Entry)" }],
  },
  {
    key: "divider4",
    type: "divider",
    label: "योजना आणि प्रकल्प",
    children: [
      { key: "projects", label: "Projects / Ongoing Works" },
      { key: "project-gallery", label: "Project Gallery" },
      { key: "schemes", label: "Schemes / Government Programs" },
    ],
  },
  {
    key: "divider5",
    type: "divider",
    label: "नागरिक सेवा",
    children: [{ key: "complaints", label: "Complaints" }],
  },
  {
    key: "divider6",
    type: "divider",
    label: "गवाचा अर्थ संकल्प",
    children: [
      { key: "expenditure-categories", label: "Expenditure Categories" },
      {
        key: "additional-income-categories",
        label: "Additional Income Categories(Date entry)",
      },
      {
        key: "additional-categories",
        label: "Additional Categories(Date entry)",
      },
      { key: "budget-summary", label: "Budget Summary (Date entry)" },
      { key: "income-categories", label: "Income Categories" },
      { key: "income-periods", label: "Income Periods" },
      { key: "expenditure-periods", label: "Expenditure Period(Data Entry)" },
      { key: "figures", label: "Figures / Key Numbers" },
    ],
  },
  {
    key: "divider7",
    type: "divider",
    label: "देणगीदारांची यादी",
    children: [{ key: "donations", label: "Donations" }],
  },
  {
    key: "divider8",
    type: "divider",
    label: "समारंभ",
    children: [],
  },
  {
    key: "divider9",
    type: "divider",
    label: "आपल्या गावचा कट्टा",
    children: [],
  },
  {
    key: "divider10",
    type: "divider",
    label: "समृद्ध ग्रामपंचायत",
    children: [],
  },
  {
    key: "divider11",
    type: "divider",
    label: "डिजिटल ग्रंथालय",
    children: [
      { label: "Digital Library(Data Entry)", key: "digital-library" },
    ],
  },
  // {
  //   key: "home",
  //   icon: <HomeOutlined />,
  //   label: "Home Page",
  //   children: [
  //     { key: "gallery", icon: <FileImageOutlined />, label: "Gallery" }, // todo: need to figure it out
  //   ],
  // },
  // project submission
  // payments
];

export default function AppMenu({ onMenuClick }) {
  return (
    <Menu
      mode="inline"
      theme="dark"
      items={items}
      onClick={(e) => onMenuClick(e.key)}
    />
  );
}
