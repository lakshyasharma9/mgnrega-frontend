import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import DistrictSelector from './components/DistrictSelector';
import Dashboard from './components/Dashboard';
import InstallPrompt from './components/InstallPrompt';
import { LanguageProvider } from './contexts/LanguageContext';

export default function App() {
  const [selectedDistrict, setSelectedDistrict] = useState<string>('');
  const [loading, setLoading] = useState(false);

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <InstallPrompt />
        {!selectedDistrict ? (
          <DistrictSelector onSelect={setSelectedDistrict} setLoading={setLoading} />
        ) : (
          <Dashboard district={selectedDistrict} onBack={() => setSelectedDistrict('')} />
        )}
      </div>
    </LanguageProvider>
  );
}
 