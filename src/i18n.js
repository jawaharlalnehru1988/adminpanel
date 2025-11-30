import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "menu.banner": "Banner Management",
      "menu.announcement": "Important Announcements",
      "menu.programmeHighlights": "Programme Highlights",
      "menu.thought": "Thoughts",
      "menu.importantNumbers": "Important Numbers (Data Entry)",
      "menu.progress": "Progress Meter",
      "menu.govt": "Government of Maharashtra",
      "menu.officeBearers": "Office Bearers (Data Entry)",
      "menu.quickLinks": "Quick Links",
      "menu.photoGallery": "Photo Gallery (Data Entry)",
      "menu.advertisement": "Advertisement",
      "menu.footerLinks": "Links & Footer",
      "menu.mainPage": "Main Page",
      "menu.ourPanchayat": "Our Panchayat",
      "menu.villageHistory": "Village History (Data Entry)",
      "menu.administration": "Administration",
      "menu.officers": "Officers (Data Entry)",
      "menu.yourVillage": "Your Village",
      "menu.myVillage": "My Village (Data Entry)",
      "menu.projectsAndSchemes": "Projects and Schemes",
      "menu.projects": "Projects / Ongoing Works",
      "menu.projectGallery": "Project Gallery",
      "menu.schemes": "Schemes / Government Programs",
      "menu.citizenServices": "Citizen Services",
      "menu.complaints": "Complaints",
      "menu.finance": "Finance",
      "menu.expenditureCategories": "Expenditure Categories",
      "menu.additionalIncomeCategories": "Additional Income Categories (Data entry)",
      "menu.additionalCategories": "Additional Categories (Data entry)",
      "menu.budgetSummary": "Budget Summary (Data entry)",
      "menu.incomeCategories": "Income Categories",
      "menu.incomePeriods": "Income Periods",
      "menu.expenditurePeriods": "Expenditure Period (Data Entry)",
      "menu.figures": "Figures / Key Numbers",
      "menu.donorsList": "Donors List",
      "menu.donations": "Donations",
      "menu.events": "Events",
      "menu.villageHangout": "Village Hangout",
      "menu.prosperousPanchayat": "Prosperous Panchayat",
      "menu.digitalLibrary": "Digital Library",
      "menu.digitalLibraryEntry": "Digital Library (Data Entry)"
    }
  },
  mr: {
    translation: {
      "menu.banner": "बॅनर व्यवस्थापन",
      "menu.announcement": "महत्वाची सूचना",
      "menu.programmeHighlights": "कार्यक्रम वैशिष्ट्ये",
      "menu.thought": "विचार",
      "menu.importantNumbers": "महत्वाचे आकडे (डेटा एंट्री)",
      "menu.progress": "प्रगती मीटर",
      "menu.govt": "महाराष्ट्र शासन",
      "menu.officeBearers": "कार्यालयीन पदाधिकारी (डेटा एंट्री)",
      "menu.quickLinks": "त्वरित दुवे",
      "menu.photoGallery": "फोटो गॅलरी (डेटा एंट्री)",
      "menu.advertisement": "जाहिरात",
      "menu.footerLinks": "दुवे व फूटर",
      "menu.mainPage": "मुख्य पृष्ठ",
      "menu.ourPanchayat": "आमची ग्रामपंचायत",
      "menu.villageHistory": "गावाचा इतिहास (डेटा एंट्री)",
      "menu.administration": "प्रशासन",
      "menu.officers": "अधिकारी (डेटा एंट्री)",
      "menu.yourVillage": "आपले गाव",
      "menu.myVillage": "माझे गाव (डेटा एंट्री)",
      "menu.projectsAndSchemes": "योजना आणि प्रकल्प",
      "menu.projects": "प्रकल्प / चालू कामे",
      "menu.projectGallery": "प्रकल्प गॅलरी",
      "menu.schemes": "योजना / शासकीय कार्यक्रम",
      "menu.citizenServices": "नागरिक सेवा",
      "menu.complaints": "तक्रारी",
      "menu.finance": "वित्त",
      "menu.expenditureCategories": "खर्च श्रेणी",
      "menu.additionalIncomeCategories": "अतिरिक्त उत्पन्न श्रेणी (डेटा एंट्री)",
      "menu.additionalCategories": "अतिरिक्त श्रेणी (डेटा एंट्री)",
      "menu.budgetSummary": "बजेट सारांश (डेटा एंट्री)",
      "menu.incomeCategories": "उत्पन्न श्रेणी",
      "menu.incomePeriods": "उत्पन्न काळ",
      "menu.expenditurePeriods": "खर्च काळ (डेटा एंट्री)",
      "menu.figures": "आकडे / मुख्य संख्या",
      "menu.donorsList": "देणगीदारांची यादी",
      "menu.donations": "देणग्या",
      "menu.events": "समारंभ",
      "menu.villageHangout": "गावाचा कट्टा",
      "menu.prosperousPanchayat": "समृद्ध ग्रामपंचायत",
      "menu.digitalLibrary": "डिजिटल ग्रंथालय",
      "menu.digitalLibraryEntry": "डिजिटल ग्रंथालय (डेटा एंट्री)"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    supportedLngs: ['en', 'mr'],
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
