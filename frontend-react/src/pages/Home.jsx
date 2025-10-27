import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ServerIcon, 
  CircleStackIcon, 
  CpuChipIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  XCircleIcon,
  QuestionMarkCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';

const Home = () => {
  const { systemHealth, checkSystemHealth, loading } = useApp();

  useEffect(() => {
    checkSystemHealth();
    const interval = setInterval(() => {
      checkSystemHealth();
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-8 w-8 text-green-500" />;
      case 'degraded':
        return <ExclamationTriangleIcon className="h-8 w-8 text-yellow-500" />;
      case 'unhealthy':
        return <XCircleIcon className="h-8 w-8 text-red-500" />;
      default:
        return <QuestionMarkCircleIcon className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusBadge = (status) => {
    const baseClasses = "px-3 py-1 rounded-full text-xs font-semibold uppercase";
    switch (status) {
      case 'healthy':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'degraded':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'unhealthy':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  };

  const services = [
    {
      name: 'API Core',
      status: systemHealth.api,
      icon: ServerIcon,
      port: '3000',
      description: 'Main backend service',
    },
    {
      name: 'Database',
      status: systemHealth.database,
      icon: CircleStackIcon,
      port: 'SQLite',
      description: 'Data persistence layer',
    },
    {
      name: 'AI Model',
      status: systemHealth.ai,
      icon: CpuChipIcon,
      port: '8000',
      description: 'YOLOv8 object detection',
    },
  ];

  const features = [
    {
      icon: '🤖',
      title: 'AI Object Detection',
      description: 'Upload images to automatically detect and catalog items using YOLOv8',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: '📦',
      title: 'Volume Calculation',
      description: 'Automatically calculate total volume for accurate moving estimates',
      color: 'from-purple-500 to-pink-500',
    },
    {
      icon: '📋',
      title: 'Booking Management',
      description: 'Create and track bookings with detailed item inventories',
      color: 'from-green-500 to-teal-500',
    },
    {
      icon: '👥',
      title: 'User Management',
      description: 'Manage customers with complete contact and booking history',
      color: 'from-orange-500 to-red-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl font-extrabold mb-4">
              Welcome to ShiftMate
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              AI-Powered Moving & Storage Management System
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* System Status */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">System Status</h2>
            <button
              onClick={checkSystemHealth}
              disabled={loading}
              className="flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ArrowPathIcon className={`h-5 w-5 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <div
                  key={service.name}
                  className="bg-gradient-to-br from-gray-50 to-white border-2 border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="bg-indigo-100 p-3 rounded-lg">
                      <Icon className="h-8 w-8 text-indigo-600" />
                    </div>
                    {getStatusIcon(service.status)}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{service.name}</h3>
                  <p className="text-sm text-gray-600 mb-3">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className={getStatusBadge(service.status)}>
                      {service.status}
                    </span>
                    <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-1 rounded">
                      {service.port}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Features Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all p-6 border-2 border-transparent hover:border-indigo-200"
              >
                <div className={`text-5xl mb-4 bg-gradient-to-r ${feature.color} w-16 h-16 rounded-lg flex items-center justify-center`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-2xl shadow-xl p-8 text-white">
          <h2 className="text-2xl font-bold mb-6 text-center">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a
              href="/upload"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center transition-all"
            >
              <div className="text-4xl mb-2">📸</div>
              <h3 className="font-bold text-lg">Upload Image</h3>
              <p className="text-sm text-white/80 mt-1">Detect items with AI</p>
            </a>
            <a
              href="/bookings"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center transition-all"
            >
              <div className="text-4xl mb-2">📋</div>
              <h3 className="font-bold text-lg">View Bookings</h3>
              <p className="text-sm text-white/80 mt-1">Manage all bookings</p>
            </a>
            <a
              href="/admin"
              className="bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl p-6 text-center transition-all"
            >
              <div className="text-4xl mb-2">⚙️</div>
              <h3 className="font-bold text-lg">Admin Panel</h3>
              <p className="text-sm text-white/80 mt-1">Manage users & stats</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
