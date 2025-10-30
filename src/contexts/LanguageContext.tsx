import React, { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextType {
  language: 'en' | 'hi';
  setLanguage: (lang: 'en' | 'hi') => void;
  t: (key: string) => string;
}

const translations = {
  en: {
    title: 'MGNREGA Dashboard',
    welcome: 'Welcome to MGNREGA District Dashboard',
    selectDistrict: 'Select Your District',
    detectLocation: 'Detect My Location',
    totalWorkers: 'Total Workers',
    totalWages: 'Total Wages Paid',
    households: 'Households Covered',
    employmentDays: 'Employment Days',
    workCompleted: 'Work Completed',
    budgetUtilization: 'Budget Utilization',
    monthlyTrend: 'Monthly Performance Trend',
    backToSelection: 'Back to District Selection',
    dataSource: 'Data sourced from data.gov.in | Built for Bharat 🇮🇳'
  },
  hi: {
    title: 'मनरेगा डैशबोर्ड',
    welcome: 'मनरेगा जिला डैशबोर्ड में आपका स्वागत है',
    selectDistrict: 'अपना जिला चुनें',
    detectLocation: 'मेरा स्थान खोजें',
    totalWorkers: 'कुल कामगार',
    totalWages: 'कुल मजदूरी भुगतान',
    households: 'परिवार शामिल',
    employmentDays: 'रोजगार दिवस',
    workCompleted: 'कार्य पूर्ण',
    budgetUtilization: 'बजट उपयोग',
    monthlyTrend: 'मासिक प्रदर्शन रुझान',
    backToSelection: 'जिला चयन पर वापस',
    dataSource: 'डेटा स्रोत: data.gov.in | भारत के लिए निर्मित 🇮🇳'
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<'en' | 'hi'>('en');

  const t = (key: string): string => {
    return translations[language][key as keyof typeof translations.en] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
 