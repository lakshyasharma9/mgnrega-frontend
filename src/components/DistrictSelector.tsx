import React, { useState, useEffect } from 'react';
import { MapPin, ChevronDown } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { detectUserLocation, getDetailedLocation, fetchAllDistricts, fetchDistrictsByState, fetchAllStates, LocationDetectionResult } from '../services/api';

interface Props {
  onSelect: (district: string) => void;
  setLoading: (loading: boolean) => void;
}

export default function DistrictSelector({ onSelect, setLoading }: Props) {
  const { t } = useLanguage();
  const [selectedState, setSelectedState] = useState<string>('');
  const [states, setStates] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);
  const [detecting, setDetecting] = useState(false);
  const [loading, setLocalLoading] = useState(false);
  const [error, setError] = useState('');
  const [statesLoading, setStatesLoading] = useState(true);
  const [locationInfo, setLocationInfo] = useState<LocationDetectionResult | null>(null);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const stateList = await fetchAllStates();
        setStates(stateList);
      } catch (err: any) {
        console.error('Error loading states:', err);
        setError('Failed to load states. Please ensure MGNREGA API data is synced and backend is running.');
      } finally {
        setStatesLoading(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (selectedState) {
      const loadDistricts = async () => {
        setLocalLoading(true);
        try {
          const districtList = await fetchDistrictsByState(selectedState);
          setDistricts(districtList);
        } catch (err: any) {
          console.error('Error loading districts:', err);
          setError('Failed to load districts. Please ensure MGNREGA API data is synced for this state.');
        } finally {
          setLocalLoading(false);
        }
      };
      loadDistricts();
    }
  }, [selectedState]);

  const handleLocationDetection = async () => {
    setDetecting(true);
    setError('');
    setLocationInfo(null);
    
    try {
      // First get detailed location info
      const locationData = await getDetailedLocation();
      setLocationInfo(locationData);
      
      if (locationData.available) {
        // If data is available, proceed to dashboard
        onSelect(locationData.district);
      } else {
        // Show location info but don't proceed
        setError(`Location detected: ${locationData.district}, ${locationData.state}. However, MGNREGA data is not available for this district. Please select manually from the list.`);
      }
    } catch (error: any) {
      setError(error.message || 'Failed to detect location. Please select manually.');
    } finally {
      setDetecting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="gov-card p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-6"></div>
            <h3 className="text-xl font-semibold text-slate-800 mb-2">जिले लोड हो रहे हैं...</h3>
            <p className="text-gray-600">Loading districts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="gov-card p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-4">त्रुटि / Error</h3>
            <p className="text-red-600 mb-6 max-w-2xl mx-auto leading-relaxed">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="gov-button-secondary"
            >
              पुन: प्रयास करें / Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="gov-card p-8 mb-8">
            <img 
              src="/MGNREGA IMG.jpeg"
              alt="Rural development in India - MGNREGA workers"
              className="w-full h-80 object-cover rounded-xl mb-6 shadow-lg"
            />
            <h2 className="text-4xl font-bold text-slate-800 mb-4">{t('welcome')}</h2>
            <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">{t('selectDistrict')}</p>
            <div className="flex justify-center items-center space-x-2 mt-4 text-gray-500">
              <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
              <span className="text-sm font-medium">सरल • विश्वसनीय • पारदर्शी</span>
              <div className="w-2 h-2 bg-green-600 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Selection Cards */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Manual Selection Card */}
          <div className="gov-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-blue-700 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="text-white" size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">राज्य और जिला चुनें</h3>
              <h4 className="text-lg text-gray-600">Select State & District</h4>
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">राज्य चुनें / Select State</label>
                <div className="relative">
                  <select 
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setDistricts([]);
                    }}
                    disabled={statesLoading}
                    className="gov-input text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{statesLoading ? 'राज्य लोड हो रहे हैं...' : 'राज्य चुनें / Choose a state'}</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={24} />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">जिला चुनें / Select District</label>
                <div className="relative">
                  <select 
                    disabled={!selectedState || loading}
                    onChange={(e) => e.target.value && onSelect(e.target.value)}
                    className="gov-input text-lg disabled:bg-gray-100 disabled:cursor-not-allowed"
                  >
                    <option value="">{!selectedState ? 'पहले राज्य चुनें / Select state first' : loading ? 'जिले लोड हो रहे हैं...' : 'जिला चुनें / Choose a district'}</option>
                    {districts.map(district => (
                      <option key={district} value={district}>{district}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" size={24} />
                </div>
              </div>
            </div>
          </div>

          {/* Auto Detection Card */}
          <div className="gov-card p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className={`text-white ${detecting ? 'animate-pulse' : ''}`} size={28} />
              </div>
              <h3 className="text-2xl font-semibold text-slate-800 mb-2">स्वचालित पहचान</h3>
              <h4 className="text-lg text-gray-600">Auto Detection</h4>
            </div>
            
            <div className="text-center">
              <button
                onClick={handleLocationDetection}
                disabled={detecting}
                className="gov-button-secondary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3"
              >
                <MapPin size={24} className={detecting ? 'animate-pulse' : ''} />
                <span>{detecting ? 'स्थान खोजा जा रहा है...' : t('detectLocation')}</span>
              </button>
              
              {detecting && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-3"></div>
                  <p className="text-blue-600 font-medium">आपका सटीक स्थान प्राप्त किया जा रहा है...</p>
                  <p className="text-sm text-gray-600 mt-1">Getting your precise location...</p>
                </div>
              )}
              
              {locationInfo && !detecting && (
                <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="font-semibold text-green-600 mb-2">📍 स्थान मिल गया / Location Detected:</p>
                  <p className="text-slate-800 font-medium text-lg">{locationInfo.district}, {locationInfo.state}</p>
                  <div className="mt-3 flex items-center justify-center space-x-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      locationInfo.available 
                        ? 'bg-green-600 text-white' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {locationInfo.available ? '✅ डेटा उपलब्ध / Data Available' : '❌ MGNREGA डेटा नहीं मिला'}
                    </span>
                  </div>
                  {locationInfo.detectedDistrict && locationInfo.detectedDistrict !== locationInfo.district && (
                    <p className="text-xs text-gray-600 mt-2">
                      मूल पहचान: {locationInfo.detectedDistrict}
                    </p>
                  )}
                </div>
              )}
              
              <p className="text-sm text-gray-500 mt-6 leading-relaxed">
                {detecting ? 'GPS और OpenStreetMap का उपयोग...' : 'GPS के साथ वास्तविक समय स्थान पहचान'}
              </p>
            </div>
          </div>
        </div>

        {/* Information Banner */}
        <div className="gov-card p-6 bg-gradient-to-r from-blue-50 to-green-50 border-l-4 border-orange-500">
          <div className="flex items-start space-x-4">
            <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white text-xl">📊</span>
            </div>
            <div>
              <h4 className="font-semibold text-slate-800 mb-2 text-lg">वास्तविक समय डेटा और स्थान / Real-Time Data & Location</h4>
              <p className="text-gray-700 leading-relaxed">
                यह डैशबोर्ड लाइव MGNREGA डेटा और OpenStreetMap के माध्यम से वास्तविक समय GPS स्थान पहचान का उपयोग करता है। स्थान पहचान तुरंत काम करती है और उपलब्ध डेटा क्षेत्रों के लिए सटीक जिला पहचान प्रदान करती है।
              </p>
              <p className="text-gray-600 text-sm mt-2">
                This dashboard uses live MGNREGA data and real-time GPS location detection via OpenStreetMap for precise district identification.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}