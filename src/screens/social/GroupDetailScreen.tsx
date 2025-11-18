import React, { useState } from 'react';
import { Heart, MessageCircle, Send, MoreVertical, UserPlus, UserMinus } from 'lucide-react';

const GroupDetailScreen = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [isMember, setIsMember] = useState(false);
  const [posts, setPosts] = useState([
    {
      id: 1,
      author: 'Sarah Johnson',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah',
      time: '2 hours ago',
      content: 'Just attended an amazing workshop on sustainable living! The tips on reducing plastic waste were incredibly practical. Who else is trying to live more sustainably?',
      likes: 24,
      comments: 8,
      liked: false
    },
    {
      id: 2,
      author: 'Mike Chen',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike',
      time: '5 hours ago',
      content: 'Looking for recommendations on local farmers markets in the area. Where does everyone shop for organic produce?',
      likes: 15,
      comments: 12,
      liked: false
    }
  ]);

  const members = [
    { id: 1, name: 'Emma Wilson', username: '@emmaw', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma', isAdmin: true },
    { id: 2, name: 'James Parker', username: '@jamesP', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James', isAdmin: true },
    { id: 3, name: 'Sarah Johnson', username: '@sarahj', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', isAdmin: false },
    { id: 4, name: 'Mike Chen', username: '@mikec', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mike', isAdmin: false },
    { id: 5, name: 'Lisa Anderson', username: '@lisaa', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa', isAdmin: false }
  ];

  const handleJoinLeave = () => {
    setIsMember(!isMember);
  };

  const handleLike = (postId: number) => {
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, liked: !post.liked, likes: post.liked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-4xl mx-auto px-4 py-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold shadow-lg">
              SL
            </div>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">Sustainable Living</h1>
              <p className="text-gray-600 mt-1">1,234 members • Public Group</p>
              <p className="text-gray-700 mt-3">A community dedicated to sharing tips, resources, and experiences about living sustainably and reducing our environmental impact.</p>
            </div>
          </div>
          
          <div className="flex gap-3 mt-6">
            <button
              onClick={handleJoinLeave}
              className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-colors ${
                isMember
                  ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {isMember ? (
                <span className="flex items-center justify-center gap-2">
                  <UserMinus size={18} />
                  Leave Group
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <UserPlus size={18} />
                  Join Group
                </span>
              )}
            </button>
            <button className="px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50">
              <MoreVertical size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'posts'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Posts
            </button>
            <button
              onClick={() => setActiveTab('members')}
              className={`py-4 font-semibold border-b-2 transition-colors ${
                activeTab === 'members'
                  ? 'border-emerald-600 text-emerald-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Members
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {activeTab === 'posts' ? (
          <div className="space-y-4">
            {isMember && (
              <div className="bg-white rounded-xl shadow-sm p-4 mb-6">
                <button className="w-full text-left px-4 py-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors text-gray-600">
                  What's on your mind?
                </button>
              </div>
            )}
            
            {posts.map(post => (
              <div key={post.id} className="bg-white rounded-xl shadow-sm p-5">
                <div className="flex items-start gap-3">
                  <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold text-gray-900">{post.author}</h3>
                        <p className="text-sm text-gray-500">{post.time}</p>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <MoreVertical size={20} />
                      </button>
                    </div>
                    <p className="mt-3 text-gray-700">{post.content}</p>
                    
                    <div className="flex items-center gap-6 mt-4 pt-4 border-t">
                      <button
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center gap-2 transition-colors ${
                          post.liked ? 'text-red-500' : 'text-gray-500 hover:text-red-500'
                        }`}
                      >
                        <Heart size={20} fill={post.liked ? 'currentColor' : 'none'} />
                        <span className="font-medium">{post.likes}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors">
                        <MessageCircle size={20} />
                        <span className="font-medium">{post.comments}</span>
                      </button>
                      <button className="flex items-center gap-2 text-gray-500 hover:text-emerald-600 transition-colors ml-auto">
                        <Send size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="p-4 border-b">
              <h2 className="font-semibold text-gray-900">{members.length} Members</h2>
            </div>
            <div className="divide-y">
              {members.map(member => (
                <div key={member.id} className="p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors">
                  <img src={member.avatar} alt={member.name} className="w-12 h-12 rounded-full" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{member.name}</h3>
                      {member.isAdmin && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded">
                          Admin
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{member.username}</p>
                  </div>
                  <button className="px-4 py-2 text-sm font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                    View Profile
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GroupDetailScreen;