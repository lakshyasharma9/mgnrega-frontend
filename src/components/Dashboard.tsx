import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, CreditCard, Home, Calendar, CheckCircle, Activity, RefreshCw, MapPin } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../contexts/LanguageContext';
import { fetchDistrictData, fetchChartData, getDetailedLocation, MGNREGAData, ChartData, LocationDetectionResult } from '../services/api';

interface Props {
  district: string;
  onBack: () => void;
}

export default function Dashboard({ district, onBack }: Props) {
  const { t } = useLanguage();
  const [data, setData] = useState<MGNREGAData | null>(null);
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [locationInfo, setLocationInfo] = useState<LocationDetectionResult | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError('');
    
    try {
      const [districtData, chart] = await Promise.all([
        fetchDistrictData(district),
        fetchChartData(district)
      ]);
      
      setData(districtData);
      setChartData(chart);
    } catch (err) {
      setError('Failed to load data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // Try to get current location info for context
    getDetailedLocation().then(setLocationInfo).catch(() => {});
  }, [district]);

  const StatCard = ({ icon: Icon, title, value, subtitle, color, bgColor, hindiTitle }: any) => (
    <div className="stat-card">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-14 h-14 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className="text-white" size={28} />
        </div>
        <div className="text-right">
          <h3 className="text-3xl font-bold text-slate-800">
            {typeof value === 'number' ? value.toLocaleString('hi-IN') : value}
          </h3>
          <p className="text-sm text-gray-600 font-medium">{subtitle}</p>
        </div>
      </div>
      <div>
        <h4 className="text-lg font-semibold text-slate-800">{title}</h4>
        <p className="text-sm text-gray-600 mt-1">{hindiTitle}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="gov-card p-12">
            <div className="flex flex-col items-center justify-center h-64">
              <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-6"></div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">डेटा लोड हो रहा है...</h3>
              <p className="text-gray-600">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-50 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="gov-card p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <span className="text-red-600 text-2xl">⚠️</span>
            </div>
            <h3 className="text-xl font-semibold text-red-800 mb-4">डेटा लोड नहीं हो सका / Data Loading Failed</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <button 
              onClick={loadData}
              className="gov-button-secondary"
            >
              पुन: प्रयास करें / Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Header Section */}
        <div className="gov-card p-6 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="flex items-center space-x-2 text-blue-700 hover:text-blue-800 font-medium transition-colors"
              >
                <ArrowLeft size={24} />
                <span className="text-lg">{t('backToSelection')}</span>
              </button>
              <div className="border-l border-gray-300 pl-4">
                <h2 className="text-3xl font-bold text-slate-800">{district} जिला</h2>
                <p className="text-lg text-gray-600">{district} District Dashboard</p>
                {locationInfo && (
                  <div className="flex items-center space-x-2 text-sm text-green-600 mt-2">
                    <MapPin size={16} />
                    <span className="font-medium">वर्तमान स्थान: {locationInfo.state}</span>
                  </div>
                )}
              </div>
            </div>
            <button 
              onClick={loadData}
              className="gov-button-primary flex items-center space-x-2"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
              <span>डेटा रिफ्रेश करें</span>
            </button>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            title={t('totalWorkers')}
            hindiTitle="कुल श्रमिक"
            value={data.totalWorkers}
            subtitle="इस महीने / This month"
            color="text-orange-500"
            bgColor="bg-orange-500"
          />
          <StatCard
            icon={CreditCard}
            title={t('totalWages')}
            hindiTitle="कुल मजदूरी"
            value={`₹${(data.totalWages / 100000).toFixed(1)}L`}
            subtitle="रुपये दिए गए / Rupees paid"
            color="text-green-600"
            bgColor="bg-green-600"
          />
          <StatCard
            icon={Home}
            title={t('households')}
            hindiTitle="परिवार"
            value={data.households}
            subtitle="लाभार्थी परिवार / Families benefited"
            color="text-blue-700"
            bgColor="bg-blue-700"
          />
          <StatCard
            icon={Calendar}
            title={t('employmentDays')}
            hindiTitle="रोजगार दिवस"
            value={data.employmentDays}
            subtitle="प्रति व्यक्ति औसत / Average per person"
            color="text-purple-600"
            bgColor="bg-purple-600"
          />
          <StatCard
            icon={CheckCircle}
            title={t('workCompleted')}
            hindiTitle="पूरा काम"
            value={`${data.workCompleted}%`}
            subtitle="परियोजनाएं पूरी / Projects completed"
            color="text-green-600"
            bgColor="bg-green-600"
          />
          <StatCard
            icon={Activity}
            title={t('budgetUtilization')}
            hindiTitle="बजट उपयोग"
            value={`${data.budgetUtilization}%`}
            subtitle="बजट का उपयोग / Budget utilized"
            color="text-orange-600"
            bgColor="bg-orange-600"
          />
        </div>

        {/* Chart Section */}
        <div className="gov-card p-8 mb-8">
          <div className="mb-6">
            <h3 className="text-2xl font-semibold text-slate-800 mb-2">{t('monthlyTrend')}</h3>
            <p className="text-gray-600">मासिक प्रगति और विकास / Monthly Progress and Development</p>
          </div>
          <div className="bg-gray-50 p-4 rounded-xl">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <YAxis 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  axisLine={{ stroke: '#cbd5e1' }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                  formatter={(value, name) => [
                    name === 'workers' ? value.toLocaleString('hi-IN') : `₹${value.toLocaleString('hi-IN')}`,
                    name === 'workers' ? 'श्रमिक / Workers' : 'मजदूरी / Wages'
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="workers" 
                  stroke="#FF9933" 
                  strokeWidth={4}
                  dot={{ fill: '#FF9933', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, stroke: '#FF9933', strokeWidth: 2 }}
                />
                <Line 
                  type="monotone" 
                  dataKey="wages" 
                  stroke="#138808" 
                  strokeWidth={3}
                  dot={{ fill: '#138808', strokeWidth: 2, r: 5 }}
                  activeDot={{ r: 7, stroke: '#138808', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Footer Information */}
        <div className="gov-card p-6 bg-gradient-to-r from-blue-50 to-orange-50 border-l-4 border-green-600">
          <div className="text-center">
            <p className="text-gray-700 font-medium mb-2">{t('dataSource')}</p>
            <p className="text-sm text-gray-600 mb-3">डेटा स्रोत: महात्मा गांधी राष्ट्रीय ग्रामीण रोजगार गारंटी योजना</p>
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-6 text-sm text-gray-600">
              <span>अंतिम अपडेट: {new Date(data.lastUpdated).toLocaleDateString('hi-IN')}</span>
              {locationInfo && (
                <span className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>वास्तविक समय स्थान: {locationInfo.formatted_address}</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}