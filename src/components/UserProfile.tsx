import React, { useState } from 'react';
import { User, Settings, CreditCard, LogOut, Crown, Zap } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface UserProfileProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfile: React.FC<UserProfileProps> = ({ isOpen, onClose }) => {
  const { user, signOut, loading, updateUserDetails } = useAuth();
  const [showPlans, setShowPlans] = useState(false);
  const [showAccountSettings, setShowAccountSettings] = useState(false);
  const [showBilling, setShowBilling] = useState(false);
  const [editName, setEditName] = useState('');
  const [editEmail, setEditEmail] = useState('');
  const [editPassword, setEditPassword] = useState('');
  const [updateError, setUpdateError] = useState('');
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updating, setUpdating] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    onClose();
  };

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'pro': return 'bg-blue-100 text-blue-800';
      case 'premium': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanIcon = (plan: string) => {
    switch (plan) {
      case 'pro': return <Zap className="h-4 w-4" />;
      case 'premium': return <Crown className="h-4 w-4" />;
      default: return null;
    }
  };

  // Handler for updating user details (placeholder, needs backend support)
  const handleUpdateDetails = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdateSuccess('');
    setUpdating(true);
    const result = await updateUserDetails({
      fullName: editName,
      email: editEmail,
      password: editPassword,
    });
    setUpdating(false);
    if (result.error) {
      setUpdateError(result.error);
    } else {
      setUpdateSuccess('Profile updated successfully.');
      setEditPassword('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Profile</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ×
            </button>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-600"></div>
            </div>
          ) : user ? (
            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="bg-red-600 p-3 rounded-full">
                  <User className="h-8 w-8 text-white" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">
                    {user.fullName || 'User'}
                  </h3>
                  <p className="text-sm text-gray-600">{user.email}</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-gray-700">Current Plan</span>
                  <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${getPlanColor(user.plan)}`}>
                    {getPlanIcon(user.plan)}
                    <span className="capitalize">{user.plan}</span>
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Credits Remaining</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {user.creditsRemaining}
                  </span>
                </div>
              </div>

              {user.plan === 'free' && !showPlans && (
                <div className="bg-gradient-to-r from-red-50 to-red-100 rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <Crown className="h-5 w-5 text-red-600" />
                    <h4 className="font-semibold text-red-800">Upgrade to Pro</h4>
                  </div>
                  <p className="text-sm text-red-700 mb-3">
                    Get unlimited generations, advanced features, and priority support.
                  </p>
                  <button
                    className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                    onClick={() => setShowPlans(true)}
                  >
                    View Plans
                  </button>
                </div>
              )}

              {showPlans && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-8 relative">
                    <button
                      onClick={() => setShowPlans(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                    >
                      ×
                    </button>
                    <h3 className="text-2xl font-bold text-center mb-8">Choose Your Plan</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Free Plan Card */}
                      <div className="border rounded-xl p-6 flex flex-col items-center bg-gray-50">
                        <span className="text-lg font-semibold text-gray-900 mb-2">Free</span>
                        <span className="text-4xl font-bold text-gray-800 mb-2">$0</span>
                        <ul className="text-gray-600 text-sm mb-4 list-disc list-inside">
                          <li>10 credits</li>
                          <li>Basic features</li>
                        </ul>
                        <span className="inline-block bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">Current Plan</span>
                      </div>
                      {/* Paid Plan Card */}
                      <div className="border-2 border-red-600 rounded-xl p-6 flex flex-col items-center bg-red-50">
                        <span className="text-lg font-semibold text-gray-900 mb-2">Pro</span>
                        <span className="text-4xl font-bold text-red-600 mb-2">$9</span>
                        <ul className="text-gray-700 text-sm mb-4 list-disc list-inside">
                          <li>Unlimited credits</li>
                          <li>Advanced features</li>
                          <li>Priority support</li>
                        </ul>
                        <button
                          className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors mt-auto"
                          onClick={handleRazorpayUpgrade}
                        >
                          Upgrade Plan
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowAccountSettings(true)}
                >
                  <Settings className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Account Settings</span>
                </button>
                <button
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                  onClick={() => setShowBilling(true)}
                >
                  <CreditCard className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-700">Billing & Plans</span>
                </button>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center space-x-3 px-4 py-3 text-left hover:bg-red-50 rounded-lg transition-colors text-red-600"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Account Settings Modal */}
              {showAccountSettings && user && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                    <button
                      onClick={() => setShowAccountSettings(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                    >
                      ×
                    </button>
                    <h3 className="text-xl font-bold mb-4">Account Settings</h3>
                    <div className="mb-6">
                      <div className="mb-2 text-gray-700"><span className="font-semibold">Current Plan:</span> <span className="capitalize">{user.plan}</span></div>
                    </div>
                    <form onSubmit={handleUpdateDetails} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                        <input
                          type="text"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={editName || user.fullName || ''}
                          onChange={e => setEditName(e.target.value)}
                          placeholder="Enter your name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input
                          type="email"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={editEmail || user.email || ''}
                          onChange={e => setEditEmail(e.target.value)}
                          placeholder="Enter your email"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password <span className="text-xs text-gray-400">(required to update)</span></label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                          value={editPassword}
                          onChange={e => setEditPassword(e.target.value)}
                          placeholder="Enter your password"
                          required
                        />
                      </div>
                      {updateError && <div className="text-red-600 text-sm">{updateError}</div>}
                      {updateSuccess && <div className="text-green-600 text-sm">{updateSuccess}</div>}
                      <button
                        type="submit"
                        className="w-full bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50"
                        disabled={updating}
                      >
                        {updating ? 'Updating...' : 'Update Profile'}
                      </button>
                    </form>
                  </div>
                </div>
              )}

              {/* Billing & Plans Modal */}
              {showBilling && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-8 relative">
                    <button
                      onClick={() => setShowBilling(false)}
                      className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
                    >
                      ×
                    </button>
                    <h3 className="text-xl font-bold mb-4">Billing & Plans</h3>
                    <p className="text-gray-700">Billing and plan management coming soon.</p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">Failed to load profile</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

function handleRazorpayUpgrade() {
  // TODO: Implement Razorpay payment flow
  window.open('https://razorpay.com/', '_blank'); // Placeholder: open Razorpay in new tab
}

export default UserProfile;