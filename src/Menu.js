import { Menu, Select } from "antd";
import { useTranslation } from "react-i18next";

const getItems = (t) => [
  {
    key: "divider1",
    type: "divider",
    label: t("menu.mainPage", { defaultValue: "मुख्य पृष्ठ" }),
    children: [
      { key: "banner", label: t("menu.banner", { defaultValue: "Banner Management" }) },
      { key: "announcement", label: t("menu.announcement", { defaultValue: "Important Announcements" }) },
      { key: "programme-highlights", label: t("menu.programmeHighlights", { defaultValue: "Programme Highlights" }) },
      { key: "thought", label: t("menu.thought", { defaultValue: "Thoughts" }) },
      { key: "important-figures", label: t("menu.importantFigures", { defaultValue: "Important Figures" }) },
      { key: "progress", label: t("menu.progress", { defaultValue: "प्रगती मीटर" }) },
      { key: "administrative-members", label: t("menu.administrativeMembers", { defaultValue: "Administrative Members" }) },
      { key: "officers", label: t("menu.officeBearers", { defaultValue: "Officers" }) },
      { key: "quick-links", label: t("menu.quickLinks", { defaultValue: "Quick Links" }) },
      { key: "photo-gallery", label: t("menu.photoGallery", { defaultValue: "Photo Gallery (Data Entry)" }) },
      { key: "advertisement", label: t("menu.advertisement", { defaultValue: "Advertisement" }) },
      { key: "footer-categories", label: t("menu.footerCategories", { defaultValue: "Footer Categories" }) },
      { key: "footer-items", label: t("menu.footerItems", { defaultValue: "Footer Items" }) },
    ],
  },
  {
    key: "divider2",
    type: "divider",
    label: t("menu.ourPanchayat", { defaultValue: "आमची ग्रामपंचायत" }),
    children: [
      { key: "village-info", label: t("menu.villageHistory", { defaultValue: "Village History" }) },
      // { key: "administration", label: t("menu.administration", { defaultValue: "Administration" }) },
      { key: "officers", label: t("menu.officers", { defaultValue: "Officers" }) },
    ],
  },
  {
    key: "divider3",
    type: "divider",
    label: t("menu.yourVillage", { defaultValue: "आपले गाव" }),
    children: [{ key: "my-village", label: t("menu.myVillage", { defaultValue: "My Village (Data Entry)" }) }],
  },
  {
    key: "divider4",
    type: "divider",
    label: t("menu.projectsAndSchemes", { defaultValue: "योजना आणि प्रकल्प" }),
    children: [
      { key: "projects", label: t("menu.projects", { defaultValue: "Projects / Ongoing Works" }) },
      { key: "project-gallery", label: t("menu.projectGallery", { defaultValue: "Project Gallery" }) },
      { key: "schemes", label: t("menu.schemes", { defaultValue: "Schemes / Government Programs" }) },
    ],
  },
  {
    key: "divider5",
    type: "divider",
    label: t("menu.citizenServices", { defaultValue: "नागरिक सेवा" }),
    children: [{ key: "complaints", label: t("menu.complaints", { defaultValue: "Complaints" }) },
    { key: "tax-payment", label: t("menu.taxPayment", { defaultValue: "Tax Payment" }) }],
  },
  {
    key: "divider6",
    type: "divider",
    label: t("menu.finance", { defaultValue: "गवाचा अर्थ संकल्प" }),
    children: [
      { key: "budget-summary", label: t("menu.budgetSummary", { defaultValue: "Budget Summary" }) },
      { key: "income-categories", label: t("menu.incomeCategories", { defaultValue: "Income Categories" }) },
      { key: "income-periods", label: t("menu.incomePeriods", { defaultValue: "Income Periods" }) },
      { key: "expenditure-categories", label: t("menu.expenditureCategories", { defaultValue: "Expenditure Categories" }) },
      { key: "expenditure-periods", label: t("menu.expenditurePeriods", { defaultValue: "Expenditure Period" }) },
      { key: "additional-income-categories", label: t("menu.additionalIncomeCategories", { defaultValue: "Additional Income Categories (Date entry)" }) },
      { key: "additional-categories", label: t("menu.additionalCategories", { defaultValue: "Additional Categories (Date entry)" }) },
    ],
  },
  {
    key: "divider7",
    type: "divider",
    label: t("menu.donorsList", { defaultValue: "देणगीदारांची यादी" }),
    children: [{ key: "donations", label: t("menu.donations", { defaultValue: "Donations" }) }],
  },
  {
    key: "divider8",
    type: "divider",
    label: t("menu.events", { defaultValue: "समारंभ" }),
    children: [],
  },
  {
    key: "divider9",
    type: "divider",
    label: t("menu.villageHangout", { defaultValue: "आपल्या गावचा कट्टा" }),
    children: [],
  },
  {
    key: "divider10",
    type: "divider",
    label: t("menu.prosperousPanchayat", { defaultValue: "समृद्ध ग्रामपंचायत" }),
    children: [],
  },
  {
    key: "divider11",
    type: "divider",
    label: t("menu.digitalLibrary", { defaultValue: "डिजिटल ग्रंथालय" }),
    children: [
      { label: t("menu.digitalLibraryEntry", { defaultValue: "Digital Library" }), key: "digital-library" },
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
  const { t, i18n } = useTranslation();

  const handleLanguageChange = (lang) => {
    if (lang) i18n.changeLanguage(lang);
  };

  const currentLang = i18n.language || "en";

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: 8, textAlign: "center" }}>
        <Select value={currentLang} onChange={handleLanguageChange} style={{ width: 140 }}>
          <Select.Option value="en">English</Select.Option>
          <Select.Option value="mr">मराठी</Select.Option>
        </Select>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <Menu
          mode="inline"
          theme="dark"
          items={getItems(t)}
          onClick={(e) => onMenuClick(e.key)}
          style={{ height: '100%', overflow: 'auto', background: 'transparent' }}
        />
      </div>
    </div>
  );
}
