import React from 'react';
import { 
  Users, 
  Target, 
  Award, 
  Leaf,
  Zap,
  Heart,
  MapPin,
  TrendingUp
} from 'lucide-react';

const AboutPage = () => {
  const team = [
    {
      name: 'ChaloCharge Engineering Team',
      role: 'Platform & Product Development',
      description: 'Building intelligent EV routing, battery range algorithms, and charging station optimization for drivers across India.',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=300&h=300'
    }
  ];

  const values = [
    {
      icon: <Leaf className="h-8 w-8 text-green-500" />,
      title: 'Sustainability First',
      description: 'We prioritize renewable energy sources and eco-friendly charging solutions to reduce carbon footprint.'
    },
    {
      icon: <Users className="h-8 w-8 text-blue-500" />,
      title: 'User-Centric Design',
      description: 'Every feature is designed with Indian EV users in mind, ensuring accessibility and ease of use.'
    },
    {
      icon: <TrendingUp className="h-8 w-8 text-purple-500" />,
      title: 'Innovation Excellence',
      description: 'We leverage smart scoring algorithms and battery-aware routing to deliver better EV charging experiences.'
    },
    {
      icon: <Heart className="h-8 w-8 text-red-500" />,
      title: 'Community Impact',
      description: 'Building an open platform that benefits both individual drivers and charging station operators.'
    }
  ];

  const milestones = [
    { year: '2025', event: 'ChaloCharge platform launched with battery-aware route planning and EV station discovery.' },
    { year: '2025', event: 'Integrated 5-factor smart station recommendation engine based on availability, detour, price, wait time, and charging speed.' },
    { year: '2025', event: 'Added multi-vehicle EV profile support (Tata Nexon EV, MG ZS EV, Hyundai Kona, etc.) and slot reservation.' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About ChaloCharge
          </h1>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            We're on a mission to make electric vehicle charging in India smarter, cheaper, and more sustainable. 
            Our AI-powered platform helps millions of EV owners optimize their charging experience while 
            contributing to a cleaner, greener future.
          </p>
          <p className="text-lg text-gray-500 mt-4">
            🚗⚡ भारत में इलेक्ट्रिक वाहन चार्जिंग को बेहतर बना रहे हैं
          </p>
        </div>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-4">
              <Target className="h-8 w-8 text-green-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Mission</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To democratize electric vehicle adoption in India by providing intelligent, cost-effective charging solutions 
              that save time, money, and promote sustainable energy usage. We believe every EV owner should have access 
              to smart charging optimization regardless of their location or vehicle type.
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="flex items-center mb-4">
              <Award className="h-8 w-8 text-blue-500 mr-3" />
              <h2 className="text-2xl font-bold text-gray-900">Our Vision</h2>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To become India's leading EV charging optimization platform, powering a sustainable transportation ecosystem 
              where renewable energy powers every journey. We envision a future where smart technology makes electric 
              vehicle ownership seamless, affordable, and environmentally responsible.
            </p>
          </div>
        </div>

        {/* Core Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <div className="flex justify-center mb-4">
                  {value.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Meet Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center hover:shadow-md transition-shadow">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-1">{member.name}</h3>
                <p className="text-green-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Company Milestones */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Journey</h2>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
            <div className="space-y-6">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start">
                  <div className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium mr-4 flex-shrink-0">
                    {milestone.year}
                  </div>
                  <p className="text-gray-700 leading-relaxed">{milestone.event}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-lg p-8 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Join the EV Revolution</h2>
          <p className="text-xl mb-6 max-w-3xl mx-auto">
            Be part of India's sustainable transportation future. Start optimizing your EV charging experience today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/trip-planner"
              className="bg-white text-green-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
            >
              Plan Your First Trip
            </a>
            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-green-600 transition-colors"
            >
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;