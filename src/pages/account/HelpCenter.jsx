import React, { useState } from 'react';
import { Search, FileText, CreditCard, Shield, Settings, Users, Headphones, Mail, MessageCircle, Phone, ChevronRight } from 'lucide-react';

const HelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const categories = [
    { icon: FileText, title: 'Getting Started', description: 'Learn the basics and set up your account', articles: 12, color: 'bg-cyan-50 text-cyan-600' },
    { icon: CreditCard, title: 'Billing & Payments', description: 'Manage subscriptions and payment methods', articles: 8, color: 'bg-green-50 text-green-600' },
    { icon: Shield, title: 'Security & Privacy', description: 'Keep your account safe and secure', articles: 15, color: 'bg-purple-50 text-purple-600' },
    { icon: Settings, title: 'Account Settings', description: 'Customize your profile and preferences', articles: 10, color: 'bg-pink-50 text-pink-600' },
    { icon: Users, title: 'Team Management', description: 'Collaborate with your team members', articles: 7, color: 'bg-red-50 text-red-600' },
    { icon: Headphones, title: 'Technical Support', description: 'Troubleshooting and technical issues', articles: 20, color: 'bg-yellow-50 text-yellow-600' },
  ];

  const popularArticles = [
    { title: 'How to create your first account', category: 'Getting Started', views: '2.5k views', readTime: '3 min read' },
    { title: 'Understanding your billing cycle', category: 'Billing & Payments', views: '1.8k views', readTime: '5 min read' },
    { title: 'Setting up two-factor authentication', category: 'Security & Privacy', views: '3.2k views', readTime: '4 min read' },
    { title: 'How to reset your password', category: 'Account Settings', views: '4.1k views', readTime: '2 min read' },
    { title: 'Inviting team members to your workspace', category: 'Team Management', views: '1.5k views', readTime: '4 min read' },
    { title: 'Troubleshooting connection issues', category: 'Technical Support', views: '2.9k views', readTime: '2 min read' },
  ];

  const supportOptions = [
    { icon: Mail, title: 'Email Support', description: "We'll respond within 24 hours", action: 'Send Email', color: 'bg-green-50' },
    { icon: MessageCircle, title: 'Chat AI', description: 'Get instant AI-powered assistance', action: 'Start Chat', color: 'bg-gray-50' },
    { icon: Phone, title: 'Phone Support', description: 'Mon-Fri, 9AM-5PM EST', action: 'Call Now', color: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-b from-gray-50 to-white py-12 text-center">
        <h1 className="text-2xl font-semibold text-teal-700 mb-2">Help Center</h1>
        <p className="text-xl font-medium text-gray-900 mb-8">How can we help you today?</p>
        
        {/* Search Bar */}
        <div className="max-w-xl mx-auto px-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search for help articles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pb-16">
        {/* Browse by Category */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">Browse by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {categories.map((category, index) => (
              <div
                key={index}
                className="p-5 border border-gray-100 rounded-xl hover:shadow-md transition-shadow cursor-pointer bg-white"
              >
                <div className={`w-10 h-10 ${category.color} rounded-lg flex items-center justify-center mb-3`}>
                  <category.icon className="w-5 h-5" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{category.title}</h3>
                <p className="text-sm text-gray-500 mb-2">{category.description}</p>
                <p className="text-xs text-gray-400">{category.articles} articles</p>
              </div>
            ))}
          </div>
        </section>

        {/* Popular Articles */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">Popular Articles</h2>
          <div className="space-y-3">
            {popularArticles.map((article, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow cursor-pointer bg-white"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center">
                    <FileText className="w-5 h-5 text-gray-400" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{article.title}</h3>
                    <p className="text-sm text-gray-400">
                      {article.category} · {article.views} · {article.readTime}
                    </p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-gray-300" />
              </div>
            ))}
          </div>
        </section>

        {/* Still Need Help */}
        <section>
          <h2 className="text-xl font-semibold text-gray-900 text-center mb-8">Still Need Help?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {supportOptions.map((option, index) => (
              <div
                key={index}
                className={`${option.color} rounded-xl p-6 text-center`}
              >
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mx-auto mb-4">
                  <option.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="font-medium text-gray-900 mb-1">{option.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{option.description}</p>
                <button className="px-6 py-2 bg-white border border-gray-200 rounded-full text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                  {option.action}
                </button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpCenter;
