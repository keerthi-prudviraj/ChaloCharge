import React, { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Calendar,
  DollarSign,
  Zap,
  Leaf
} from 'lucide-react';
import PriceChart from '../components/PriceChart';

const InsightsPage = () => {
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');

  const priceData = [
    { time: '00:00', price: 8.5 },
    { time: '06:00', price: 12.2 },
    { time: '12:00', price: 15.8 },
    { time: '18:00', price: 18.4 },
    { time: '24:00', price: 10.1 }
  ];

  const usageStats = [
    { label: 'Fast Charging', value: 45, color: 'bg-blue-500' },
    { label: 'Standard Charging', value: 35, color: 'bg-green-500' },
    { label: 'Rapid Charging', value: 20, color: 'bg-purple-500' }
  ];

  const insights = [
    {
      icon: <TrendingDown className="h-8 w-8 text-green-500" />,
      title: 'Current Price Trend',
      description: 'Electricity prices have decreased by 15% this week due to high solar generation.',
      trend: 'positive'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-red-500" />,
      title: 'Peak Hours Notice',
      description: 'Charging costs are 40% higher between 6 PM - 9 PM on weekdays.',
      trend: 'negative'
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: 'Renewable Energy Status',
      description: '85% renewable energy available between 11 AM - 3 PM daily.',
      trend: 'positive'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      title: 'Cost Analysis',
      description: 'Users saved average ₹180 per charge by following optimal charging times.',
      trend: 'positive'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Market Insights & Sample Prices
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Current electricity prices and charging trend analysis
          </p>
          <p className="text-lg text-gray-500 dark:text-gray-400 mt-2">
            📊 बिजली की कीमतों का विश्लेषण और नमूना डेटा
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
                <TrendingDown className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Price</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹12.5/kWh</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                <Zap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Peak Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹18.2/kWh</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                <Leaf className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Solar Hours</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹8.5/kWh</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-colors duration-200">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 dark:bg-orange-900/20 rounded-lg">
                <DollarSign className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Savings</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">₹180</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Price Forecast Chart */}
          <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <BarChart3 className="h-5 w-5 mr-2 text-blue-500" />
                Sample Electricity Prices
              </h2>
              <select className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-1 text-sm dark:bg-gray-700 dark:text-white transition-colors duration-200">
                <option>Last 7 Days</option>
                <option>Last 30 Days</option>
                <option>Last 3 Months</option>
              </select>
            </div>

            {/* Price Chart */}
            <PriceChart />
            
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-200">
                <strong>Sample Data:</strong> Prices vary throughout the day, with peak hours (6 PM - 9 PM) showing higher rates due to increased demand.
              </p>
            </div>
          </div>

          {/* Charging Type Distribution */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
              <PieChart className="h-5 w-5 mr-2 text-green-500" />
              Charging Types
            </h2>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Fast Charging</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">45%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Standard</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">35%</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-3 h-3 bg-purple-500 rounded-full mr-3"></div>
                  <span className="text-gray-700 dark:text-gray-300">Rapid</span>
                </div>
                <span className="font-semibold text-gray-900 dark:text-white">20%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insights Grid */}
        <div className="mt-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            📊 Market Trends & Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {insights.map((insight, index) => (
              <div key={index} className={`bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 transition-all duration-200 ${
                insight.trend === 'positive' ? 'hover:shadow-green-100 dark:hover:shadow-green-900/20' : 'hover:shadow-red-100 dark:hover:shadow-red-900/20'
              }`}>
                <div className="mb-4">{insight.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{insight.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">{insight.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Regional Analysis */}
        <div className="mt-12 bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 transition-colors duration-200">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-orange-500" />
            Regional Price Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Hyderabad</h3>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">₹11.2/kWh</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">-8% from last week</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Delhi</h3>
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">₹14.8/kWh</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+12% from last week</p>
            </div>

            <div className="text-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Mumbai</h3>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">₹13.5/kWh</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">+3% from last week</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsightsPage;