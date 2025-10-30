import React from 'react';
import { Globe, Shield } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export default function Header() {
  const { language, setLanguage, t } = useLanguage();

  return (
    <>
      {/* Main Header */}
      <header className="bg-white border-b-4 border-orange-500 shadow-lg">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-orange-500 shadow-md">
                  <img 
                    src="/flag.jpg" 
                    alt="Indian Flag" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-slate-800 leading-tight">{t('title')}</h1>
                  <p className="text-sm text-gray-600 font-medium">महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setLanguage(language === 'en' ? 'hi' : 'en')}
                className="flex items-center space-x-2 bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-800 transition-all duration-200 font-medium shadow-sm"
              >
                <Globe size={18} />
                <span className="text-sm">{language === 'en' ? 'हिन्दी' : 'English'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
 