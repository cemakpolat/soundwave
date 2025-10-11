// src/pages/AdminSettings.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  CogIcon, 
  ShieldCheckIcon, 
  MailIcon, 
  UserGroupIcon, 
  CloudUploadIcon,
  CheckCircleIcon,
  EyeIcon,
  EyeOffIcon,
  SaveIcon
} from '@heroicons/react/outline';

const AdminSettings = () => {
  // Platform settings
  const [platformName, setPlatformName] = useState('SoundWave');
  const [platformLogo, setPlatformLogo] = useState('/api/placeholder/100/100');
  const [supportEmail, setSupportEmail] = useState('support@soundwave.com');
  
  // Content moderation settings
  const [requireContentApproval, setRequireContentApproval] = useState(true);
  const [explicitContentFilter, setExplicitContentFilter] = useState('moderate');
  const [userReportThreshold, setUserReportThreshold] = useState(3);
  const [autoFlagKeywords, setAutoFlagKeywords] = useState('keyword1, keyword2, keyword3');

  // User permissions settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [allowCreatorApplications, setAllowCreatorApplications] = useState(true);
  const [maxUploadSize, setMaxUploadSize] = useState(50);
  const [maxUploadsPerDay, setMaxUploadsPerDay] = useState(10);
  
  // Password settings
  const [adminPassword, setAdminPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Upload preview
  const [newLogo, setNewLogo] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  // Form states
  const [activeTab, setActiveTab] = useState('general');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewLogo(file);
      const reader = new FileReader();
      reader.onload = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGeneralSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleModerationSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handleUserPermissionsSubmit = (e) => {
    e.preventDefault();
    handleSave();
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (adminPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    handleSave();
  };

  const handleSave = () => {
    setIsSaving(true);
    setError(null);
    
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-spotify-white">Admin Settings</h1>
          <p className="text-spotify-light mt-1">Configure platform settings and preferences</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        {/* Settings tabs */}
        <div className="md:col-span-1">
          <div className="bg-spotify-dark-gray rounded-lg p-4">
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('general')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'general' 
                    ? 'bg-spotify-green text-black' 
                    : 'text-spotify-light hover:text-spotify-white hover:bg-spotify-light-gray hover:bg-opacity-20'
                }`}
              >
                <CogIcon className={`mr-3 h-5 w-5 ${
                  activeTab === 'general' ? 'text-black' : 'text-spotify-light'
                }`} />
                General Settings
              </button>
              <button
                onClick={() => setActiveTab('moderation')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'moderation' 
                    ? 'bg-spotify-green text-black' 
                    : 'text-spotify-light hover:text-spotify-white hover:bg-spotify-light-gray hover:bg-opacity-20'
                }`}
              >
                <ShieldCheckIcon className={`mr-3 h-5 w-5 ${
                  activeTab === 'moderation' ? 'text-black' : 'text-spotify-light'
                }`} />
                Content Moderation
              </button>
              <button
                onClick={() => setActiveTab('permissions')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'permissions' 
                    ? 'bg-spotify-green text-black' 
                    : 'text-spotify-light hover:text-spotify-white hover:bg-spotify-light-gray hover:bg-opacity-20'
                }`}
              >
                <UserGroupIcon className={`mr-3 h-5 w-5 ${
                  activeTab === 'permissions' ? 'text-black' : 'text-spotify-light'
                }`} />
                User Permissions
              </button>
              <button
                onClick={() => setActiveTab('password')}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                  activeTab === 'password' 
                    ? 'bg-spotify-green text-black' 
                    : 'text-spotify-light hover:text-spotify-white hover:bg-spotify-light-gray hover:bg-opacity-20'
                }`}
              >
                <MailIcon className={`mr-3 h-5 w-5 ${
                  activeTab === 'password' ? 'text-black' : 'text-spotify-light'
                }`} />
                Security
              </button>
            </nav>
          </div>
        </div>

        {/* Settings content */}
        <div className="md:col-span-4">
          <div className="bg-spotify-dark-gray rounded-lg p-6">
            {/* Success message */}
            {saveSuccess && (
              <motion.div 
                className="mb-4 bg-green-500 bg-opacity-20 text-green-500 px-4 py-3 rounded flex items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-spotify-white mb-4">General Platform Settings</h2>
                <form onSubmit={handleGeneralSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="platformName" className="block text-sm font-medium text-spotify-light mb-1">
                        Platform Name
                      </label>
                      <input
                        id="platformName"
                        type="text"
                        value={platformName}
                        onChange={(e) => setPlatformName(e.target.value)}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="supportEmail" className="block text-sm font-medium text-spotify-light mb-1">
                        Support Email
                      </label>
                      <input
                        id="supportEmail"
                        type="email"
                        value={supportEmail}
                        onChange={(e) => setSupportEmail(e.target.value)}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="platformLogo" className="block text-sm font-medium text-spotify-light mb-1">
                        Platform Logo
                      </label>
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0">
                          <img 
                            src={logoPreview || platformLogo} 
                            alt="Platform Logo" 
                            className="w-20 h-20 rounded-md object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="relative border-2 border-dashed border-spotify-light border-opacity-50 rounded-lg p-4 flex flex-col items-center justify-center h-32">
                            <CloudUploadIcon className="h-8 w-8 text-spotify-light mb-2" />
                            <p className="text-spotify-light text-sm text-center">
                              Drag & drop your logo here or click to browse
                            </p>
                            <input
                              id="platformLogo"
                              type="file"
                              accept="image/*"
                              onChange={handleLogoChange}
                              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            />
                          </div>
                          <p className="text-xs text-spotify-light mt-1">
                            Recommended size: 512x512px, PNG or JPG format.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-spotify-green
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Content Moderation Settings */}
            {activeTab === 'moderation' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-spotify-white mb-4">Content Moderation Settings</h2>
                <form onSubmit={handleModerationSubmit}>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="requireContentApproval"
                          type="checkbox"
                          checked={requireContentApproval}
                          onChange={() => setRequireContentApproval(!requireContentApproval)}
                          className="h-4 w-4 text-spotify-green bg-spotify-light-gray rounded border-none
                                   focus:ring-spotify-green focus:ring-offset-spotify-black"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="requireContentApproval" className="text-sm font-medium text-spotify-white">
                          Require Content Approval
                        </label>
                        <p className="text-spotify-light text-xs">
                          All uploaded tracks will require admin approval before becoming publicly available
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="explicitContentFilter" className="block text-sm font-medium text-spotify-light mb-1">
                        Explicit Content Filter
                      </label>
                      <select
                        id="explicitContentFilter"
                        value={explicitContentFilter}
                        onChange={(e) => setExplicitContentFilter(e.target.value)}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                      >
                        <option value="none">None (No Filtering)</option>
                        <option value="moderate">Moderate (Flag Explicit Content)</option>
                        <option value="strict">Strict (Block Explicit Content)</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="userReportThreshold" className="block text-sm font-medium text-spotify-light mb-1">
                        User Report Threshold
                      </label>
                      <input
                        id="userReportThreshold"
                        type="number"
                        min="1"
                        max="100"
                        value={userReportThreshold}
                        onChange={(e) => setUserReportThreshold(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                      />
                      <p className="text-spotify-light text-xs mt-1">
                        Number of user reports needed before content is automatically flagged for review
                      </p>
                    </div>
                    
                    <div>
                      <label htmlFor="autoFlagKeywords" className="block text-sm font-medium text-spotify-light mb-1">
                        Auto-Flag Keywords
                      </label>
                      <textarea
                        id="autoFlagKeywords"
                        value={autoFlagKeywords}
                        onChange={(e) => setAutoFlagKeywords(e.target.value)}
                        rows="3"
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                        placeholder="Enter keywords separated by commas"
                      ></textarea>
                      <p className="text-spotify-light text-xs mt-1">
                        Content containing these keywords will be automatically flagged for review
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-spotify-green
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* User Permissions Settings */}
            {activeTab === 'permissions' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-spotify-white mb-4">User Permissions Settings</h2>
                <form onSubmit={handleUserPermissionsSubmit}>
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="requireEmailVerification"
                          type="checkbox"
                          checked={requireEmailVerification}
                          onChange={() => setRequireEmailVerification(!requireEmailVerification)}
                          className="h-4 w-4 text-spotify-green bg-spotify-light-gray rounded border-none
                                   focus:ring-spotify-green focus:ring-offset-spotify-black"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="requireEmailVerification" className="text-sm font-medium text-spotify-white">
                          Require Email Verification
                        </label>
                        <p className="text-spotify-light text-xs">
                          Users must verify their email address before using the platform
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="allowCreatorApplications"
                          type="checkbox"
                          checked={allowCreatorApplications}
                          onChange={() => setAllowCreatorApplications(!allowCreatorApplications)}
                          className="h-4 w-4 text-spotify-green bg-spotify-light-gray rounded border-none
                                   focus:ring-spotify-green focus:ring-offset-spotify-black"
                        />
                      </div>
                      <div className="ml-3">
                        <label htmlFor="allowCreatorApplications" className="text-sm font-medium text-spotify-white">
                          Allow Creator Applications
                        </label>
                        <p className="text-spotify-light text-xs">
                          Users can apply to become content creators
                        </p>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="maxUploadSize" className="block text-sm font-medium text-spotify-light mb-1">
                        Maximum Upload Size (MB)
                      </label>
                      <input
                        id="maxUploadSize"
                        type="number"
                        min="1"
                        max="1000"
                        value={maxUploadSize}
                        onChange={(e) => setMaxUploadSize(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="maxUploadsPerDay" className="block text-sm font-medium text-spotify-light mb-1">
                        Maximum Uploads Per Day
                      </label>
                      <input
                        id="maxUploadsPerDay"
                        type="number"
                        min="1"
                        max="100"
                        value={maxUploadsPerDay}
                        onChange={(e) => setMaxUploadsPerDay(parseInt(e.target.value))}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving}
                      className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-spotify-green
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Save Settings
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}

            {/* Password Settings */}
            {activeTab === 'password' && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <h2 className="text-xl font-bold text-spotify-white mb-4">Security Settings</h2>
                <form onSubmit={handlePasswordSubmit}>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="adminPassword" className="block text-sm font-medium text-spotify-light mb-1">
                        Change Admin Password
                      </label>
                      <div className="relative">
                        <input
                          id="adminPassword"
                          type={showPassword ? 'text' : 'password'}
                          value={adminPassword}
                          onChange={(e) => setAdminPassword(e.target.value)}
                          className="w-full px-3 py-2 rounded-md
                                    bg-spotify-light-gray text-spotify-white
                                    focus:outline-none focus:ring-2 focus:ring-spotify-green"
                          placeholder="New password"
                        />
                        <button
                          type="button"
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-spotify-light"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOffIcon className="h-5 w-5" />
                          ) : (
                            <EyeIcon className="h-5 w-5" />
                          )}
                        </button>
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-spotify-light mb-1">
                        Confirm New Password
                      </label>
                      <input
                        id="confirmPassword"
                        type={showPassword ? 'text' : 'password'}
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2 rounded-md
                                  bg-spotify-light-gray text-spotify-white
                                  focus:outline-none focus:ring-2 focus:ring-spotify-green"
                        placeholder="Confirm new password"
                      />
                    </div>
                    
                    <div className="bg-spotify-light-gray bg-opacity-20 p-4 rounded-md">
                      <h3 className="text-sm font-medium text-spotify-white mb-2">Password Requirements</h3>
                      <ul className="text-xs text-spotify-light list-disc pl-5 space-y-1">
                        <li>Minimum 8 characters long</li>
                        <li>Must include at least one uppercase letter</li>
                        <li>Must include at least one number</li>
                        <li>Must include at least one special character</li>
                      </ul>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-end">
                    <button
                      type="submit"
                      disabled={isSaving || !adminPassword || !confirmPassword}
                      className="bg-spotify-green text-black px-4 py-2 rounded-full text-sm font-medium
                               hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-spotify-green
                               disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                    >
                      {isSaving ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-black mr-2"></div>
                          Saving...
                        </>
                      ) : (
                        <>
                          <SaveIcon className="h-4 w-4 mr-2" />
                          Change Password
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;