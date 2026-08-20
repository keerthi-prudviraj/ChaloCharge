import React from 'react';
import { Zap, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-500 p-2 rounded-lg">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">ChaloCharge</span>
            </div>
            <p className="text-gray-300 mb-4 max-w-md">
              Empowering India's EV revolution with smart charging solutions. 
              Plan cost-effective routes, find the best charging stations, and contribute to a sustainable future.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
              <Mail className="h-5 w-5 text-gray-400 hover:text-white cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-gray-300">
              <li><a href="/map" className="hover:text-white transition-colors">Find Charging Stations</a></li>
              <li><a href="/trip-planner" className="hover:text-white transition-colors">Plan Your Trip</a></li>
              <li><a href="/insights" className="hover:text-white transition-colors">Price Insights</a></li>
              <li><a href="/about" className="hover:text-white transition-colors">About Us</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-300">
              <li>support@chalochatge.com</li>
              <li>+91 98765 43210</li>
              <li>Hyderabad, Telangana</li>
              <li>भारत में EV चार्जिंग</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 ChaloCharge. All rights reserved. Made with ❤️ for India's EV future.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;