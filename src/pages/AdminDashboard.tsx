import React, { useState, useEffect } from 'react';
import { ShieldCheck, Users, Building, Calendar, DollarSign, Activity, CheckCircle } from 'lucide-react';
import { api } from '../services/api';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    total_users: 2,
    total_stations: 7,
    total_bookings: 3,
    total_trips: 5,
    total_revenue_inr: 945,
    system_status: 'Healthy (FastAPI / PostgreSQL)'
  });

  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    async function loadAdminData() {
      try {
        const sData = await api.getAdminStats();
        if (sData) setStats(sData);

        const uData = await api.getAdminUsers();
        if (uData && uData.length > 0) setUsers(uData);
        else {
          setUsers([
            { id: 1, email: 'admin@chalocharge.com', full_name: 'ChaloCharge Admin', role: 'admin', chalo_points: 500 },
            { id: 2, email: 'owner@chalocharge.com', full_name: 'Station Owner Demo', role: 'station_owner', chalo_points: 200 },
            { id: 3, email: 'driver@chalocharge.com', full_name: 'EV Driver Demo', role: 'user', chalo_points: 150 }
          ]);
        }
      } catch (err) {
        console.error(err);
      }
    }
    loadAdminData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
              <ShieldCheck className="h-8 w-8 text-purple-600 mr-3" />
              Platform Admin Control Portal
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              Monitor system health, manage platform users, approve station onboarding, and view revenue analytics.
            </p>
          </div>

          <span className="bg-purple-100 text-purple-800 text-xs px-3 py-1.5 rounded-full font-bold flex items-center">
            <Activity className="h-4 w-4 mr-1.5 text-purple-600" />
            {stats.system_status}
          </span>
        </div>

        {/* Admin Metric Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-medium">Registered Users</span>
              <Users className="h-5 w-5 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_users}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-medium">Active EV Stations</span>
              <Building className="h-5 w-5 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_stations}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-medium">Total Bookings</span>
              <Calendar className="h-5 w-5 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{stats.total_bookings}</div>
          </div>

          <div className="bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
            <div className="flex items-center justify-between text-gray-500">
              <span className="text-xs font-medium">Platform Revenue</span>
              <DollarSign className="h-5 w-5 text-emerald-500" />
            </div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-2">₹{stats.total_revenue_inr}</div>
          </div>
        </div>

        {/* User Management Table */}
        <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm p-6">
          <h3 className="text-base font-bold text-gray-900 dark:text-white mb-4">Registered Platform Accounts</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-gray-50 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                <tr>
                  <th className="p-3">User ID</th>
                  <th className="p-3">Full Name</th>
                  <th className="p-3">Email Address</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">ChaloPoints</th>
                  <th className="p-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((u) => (
                  <tr key={u.id}>
                    <td className="p-3 font-mono font-bold">#{u.id}</td>
                    <td className="p-3 font-medium text-gray-900 dark:text-white">{u.full_name || 'User'}</td>
                    <td className="p-3 text-gray-600 dark:text-gray-400">{u.email}</td>
                    <td className="p-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-800' : u.role === 'station_owner' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="p-3 font-bold text-yellow-600">{u.chalo_points} pts</td>
                    <td className="p-3 text-green-600 font-semibold">Active</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
