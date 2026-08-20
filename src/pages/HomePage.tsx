import React from 'react';
import { Link } from 'react-router-dom';
import { 
  MapPin, 
  Zap, 
  DollarSign, 
  Clock, 
  Leaf, 
  TrendingUp,
  ArrowRight,
  Users,
  Award,
  Target
} from 'lucide-react';

const HomePage = () => {
  const features = [
    {
      icon: <MapPin className="h-8 w-8 text-green-500" />,
      title: 'Smart Station Finder',
      description: 'Locate nearby charging stations with real-time availability and pricing information.'
    },
    {
      icon: <DollarSign className="h-8 w-8 text-blue-500" />,
      title: 'Cost Optimization',
      description: 'AI-powered recommendations to minimize your charging costs and maximize savings.'
    },
    {
      icon: <Clock className="h-8 w-8 text-purple-500" />,
      title: 'Time Efficiency',
      description: 'Reduce waiting time with intelligent routing to available charging points.'
    },
    {
      icon: <Leaf className="h-8 w-8 text-green-600" />,
      title: 'Renewable Focus',
      description: 'Prioritize charging stations powered by clean, renewable energy sources.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-orange-500" />,
      title: 'Price Forecasting',
      description: 'Advanced AI models predict electricity prices to help you plan better.'
    },
    {
      icon: <Target className="h-8 w-8 text-red-500" />,
      title: 'Route Planning',
      description: 'Optimal route suggestions based on cost, time, and charging requirements.'
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              Smart EV Charging for
              <span className="text-green-600 dark:text-green-400"> Smart India</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
            Plan smarter electric journeys with real-time charging station insights.
            Save money, reduce wait times, and drive greener with ChaloCharge.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mb-8 font-medium">
            भारत में इलेक्ट्रिक वाहनों की चार्जिंग को सरल, सुलभ और स्मार्ट बनाएं।
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/trip-planner"
                className="bg-green-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center group"
              >
                Plan Your Trip
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/map"
                className="bg-white dark:bg-gray-800 text-green-600 dark:text-green-400 px-8 py-4 rounded-lg font-semibold border-2 border-green-600 dark:border-green-400 hover:bg-green-50 dark:hover:bg-gray-700 transition-colors"
              >
                Explore Map
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Why Choose ChaloCharge?
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Our platform combines cutting-edge AI technology with comprehensive charging station data 
              to deliver the best EV charging experience in India.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm hover:shadow-lg transition-all duration-200 border border-gray-100 dark:border-gray-700">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{feature.title}</h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Revolutionize Your EV Experience?
          </h2>
          <p className="text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Join thousands of smart EV owners who are already saving money and time with ChaloCharge.
          </p>
          <Link
            to="/trip-planner"
            className="bg-white text-green-600 px-8 py-4 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center group"
          >
            Start Planning Now
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;