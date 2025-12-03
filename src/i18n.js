import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      "menu.banner": "Banner",
      "menu.announcement": "Important Announcements",
      "menu.programmeHighlights": "Programme Highlights",
      "menu.thought": "Thoughts",
      "menu.importantFigures": "Important Figures",
      "menu.progress": "Progress Meter",
      "menu.administrativeMembers": "Administrative Members",
      "menu.officeBearers": "Office Bearers",
      "menu.quickLinks": "Quick Links",
      "menu.photoGallery": "Photo Gallery",
      "menu.advertisement": "Advertisement",
      "menu.footerItems": "Footer Items",
      "menu.footerCategories": "Footer Categories",
      "menu.mainPage": "Main Page",
      "menu.ourPanchayat": "Our Panchayat",
      "menu.villageHistory": "Village History",
      "menu.administration": "Administration",
      "menu.officers": "Officers",
      "menu.yourVillage": "Your Village",
      "menu.myVillage": "My Village",
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
      "menu.budgetSummary": "Budget Summary",
      "menu.incomeCategories": "Income Categories",
      "menu.incomePeriods": "Income Periods",
      "menu.expenditurePeriods": "Expenditure Period",
      "menu.figures": "Figures / Key Numbers",
      "menu.donorsList": "Donors List",
      "menu.donations": "Donations",
      "menu.events": "Events",
      "menu.villageHangout": "Village Hangout",
      "menu.prosperousPanchayat": "Prosperous Panchayat",
      "menu.digitalLibrary": "Digital Library",
      "menu.digitalLibraryEntry": "Digital Library"
    }
  },
  mr: {
    translation: {
      "menu.banner": "बॅनर व्यवस्थापन",
      "menu.announcement": "महत्वाची सूचना",
      "menu.programmeHighlights": "कार्यक्रम वैशिष्ट्ये",
      "menu.thought": "विचार",
      "menu.importantFigures": "महत्वाचे आकडे",
      "menu.progress": "प्रगती मीटर",
      "menu.administrativeMembers": "महाराष्ट्र शासन",
      "menu.officeBearers": "कार्यालयीन पदाधिकारी",
      "menu.quickLinks": "त्वरित दुवे",
      "menu.photoGallery": "फोटो गॅलरी",
      "menu.advertisement": "जाहिरात",
      "menu.footerItems": "फूटर आयटम्स",
      "menu.footerCategories": "फूटर श्रेणी",
      "menu.mainPage": "मुख्य पृष्ठ",
      "menu.ourPanchayat": "आमची ग्रामपंचायत",
      "menu.villageHistory": "गावाचा इतिहास",
      "menu.administration": "प्रशासन",
      "menu.officers": "अधिकारी",
      "menu.yourVillage": "आपले गाव",
      "menu.myVillage": "माझे गाव",
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
      "menu.budgetSummary": "बजेट सारांश",
      "menu.incomeCategories": "उत्पन्न श्रेणी",
      "menu.incomePeriods": "उत्पन्न काळ",
      "menu.expenditurePeriods": "खर्च काळ",
      "menu.figures": "आकडे / मुख्य संख्या",
      "menu.donorsList": "देणगीदारांची यादी",
      "menu.donations": "देणग्या",
      "menu.events": "समारंभ",
      "menu.villageHangout": "गावाचा कट्टा",
      "menu.prosperousPanchayat": "समृद्ध ग्रामपंचायत",
      "menu.digitalLibrary": "डिजिटल ग्रंथालय",
      "menu.digitalLibraryEntry": "डिजिटल ग्रंथालय"
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
