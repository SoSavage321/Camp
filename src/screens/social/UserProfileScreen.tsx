// UserProfileScreen Component

import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MoreVertical, UserPlus, UserMinus, Mail, Flag, Ban, MapPin, Briefcase, GraduationCap } from 'lucide-react';


const UserProfileScreen = () => {
  const [activeTab, setActiveTab] = useState('activity');
  const [isFollowing, setIsFollowing] = useState(false);
  const [showOptions, setShowOptions] = useState(false);

  const userProfile = {
    name: 'Sarah Johnson',
    username: '@sarahj',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
    bio: 'Passionate about sustainable living and environmental conservation. Coffee lover ☕ | Marathon runner 🏃‍♀️',
    stats: {
      followers: 1234,
      following: 567,
      events: 42
    },
    about: {
      education: 'MSc Environmental Science, UC Berkeley',
      location: 'San Francisco, CA',
      email: 'sarah.j@email.com',
      interests: ['Sustainability', 'Running', 'Photography', 'Cooking', 'Travel']
    }
  };

  const activities = [
    { id: 1, type: 'post', content: 'Posted in Sustainable Living group', time: '2 hours ago' },
    { id: 2, type: 'event', content: 'Attending "Green Living Workshop"', time: '1 day ago' },
    { id: 3, type: 'like', content: 'Liked a post in Climate Action', time: '2 days ago' },
    { id: 4, type: 'join', content: 'Joined Zero Waste Community', time: '3 days ago' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Profile Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            <img src={userProfile.avatar} alt={userProfile.name} className="w-24 h-24 rounded-full" />
            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{userProfile.name}</h1>
                  <p className="text-gray-600">{userProfile.username}</p>
                </div>
                <div className="relative">
                  <button
                    onClick={() => setShowOptions(!showOptions)}
                    className="p-2 hover:bg-gray-100 rounded-lg"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {showOptions && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border py-1 z-10">
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-gray-700">
                        <Ban size={16} />
                        Block User
                      </button>
                      <button className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center gap-2 text-red-600">
                        <Flag size={16} />
                        Report User
                      </button>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="mt-3 text-gray-700">{userProfile.bio}</p>
              
              <div className="flex gap-6 mt-4">
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.followers}</div>
                  <div className="text-sm text-gray-600">Followers</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.following}</div>
                  <div className="text-sm text-gray-600">Following</div>
                </div>
                <div className="text-center">
                  <div className="text-xl font-bold text-gray-900">{userProfile.stats.events}</div>
                  <div className="text-sm text-gray-600">Events</div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsFollowing(!isFollowing)}
                  className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors ${
                    isFollowing
                      ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button className="flex-1 py-2.5 px-4 bg-gray-100 text-gray-700 rounded-lg font-semibold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                  <Mail size={18} />
                  Message
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('activity')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Activity
            </button>
            <button
              onClick={() => setActiveTab('about')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'about'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              About
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'activity' ? (
          <div className="space-y-3">
            {activities.map(activity => (
              <div key={activity.id} className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    {activity.type === 'post' && <MessageCircle size={18} className="text-blue-600" />}
                    {activity.type === 'event' && <span className="text-blue-600">📅</span>}
                    {activity.type === 'like' && <Heart size={18} className="text-blue-600" />}
                    {activity.type === 'join' && <UserPlus size={18} className="text-blue-600" />}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900">{activity.content}</p>
                    <p className="text-sm text-gray-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <GraduationCap size={20} />
                  <h3 className="font-semibold">Education</h3>
                </div>
                <p className="text-gray-900 ml-7">{userProfile.about.education}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <MapPin size={20} />
                  <h3 className="font-semibold">Location</h3>
                </div>
                <p className="text-gray-900 ml-7">{userProfile.about.location}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-2">
                  <Mail size={20} />
                  <h3 className="font-semibold">Email</h3>
                </div>
                <p className="text-gray-900 ml-7">{userProfile.about.email}</p>
              </div>
              
              <div>
                <div className="flex items-center gap-2 text-gray-600 mb-3">
                  <Briefcase size={20} />
                  <h3 className="font-semibold">Interests</h3>
                </div>
                <div className="flex flex-wrap gap-2 ml-7">
                  {userProfile.about.interests.map((interest, index) => (
                    <span key={index} className="px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default UserProfileScreen;