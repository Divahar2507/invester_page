import React, { useState } from 'react';
import Catalog from './pages/Catalog';
import Login from './pages/Login';
import SocialAuth from './components/SocialAuth';
import Onboarding from './pages/Onboarding';
import DashboardLayout from './components/DashboardLayout';

// In JavaScript, we replace the Enum with a plain Object
const AppState = {
  CATALOG: 'CATALOG',
  LOGIN: 'LOGIN',
  SOCIAL_AUTH: 'SOCIAL_AUTH',
  ONBOARDING: 'ONBOARDING',
  DASHBOARD: 'DASHBOARD'
};

const App = () => {
  // Removed <AppState> and <User | null> type definitions
  const [currentStep, setCurrentStep] = useState(AppState.CATALOG);
  const [user, setUser] = useState(null);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [loginHint, setLoginHint] = useState('');

  const handleSelectDashboard = (id) => {
    setSelectedTemplate(id);
    setCurrentStep(AppState.LOGIN);
  };

  const handleLogin = (email) => {
    setUser({ email, name: email.split('@')[0] });
    setCurrentStep(AppState.ONBOARDING);
  };

  const startSocialAuth = (provider, email) => {
    setSelectedProvider(provider);
    setLoginHint(email);
    setCurrentStep(AppState.SOCIAL_AUTH);
  };

  const completeSocialAuth = (email) => {
    setUser({ email, name: email.split('@')[0] });
    setCurrentStep(AppState.ONBOARDING);
  };

  const renderContent = () => {
    switch (currentStep) {
      case AppState.CATALOG:
        return <Catalog onSelect={handleSelectDashboard} />;
      case AppState.LOGIN:
        return <Login onLogin={handleLogin} onSocialLogin={startSocialAuth} />;
      case AppState.SOCIAL_AUTH:
        return (
          <SocialAuth
            provider={selectedProvider}
            loginHint={loginHint}
            onContinue={completeSocialAuth}
            onBack={() => setCurrentStep(AppState.LOGIN)}
          />
        );
      case AppState.ONBOARDING:
        return (
          <Onboarding
            onComplete={() => setCurrentStep(AppState.DASHBOARD)}
          />
        );
      case AppState.DASHBOARD:
        return (
          <DashboardLayout
            user={user}
            onLogout={() => setCurrentStep(AppState.CATALOG)}
            initialTemplate={selectedTemplate}
          />
        );
      default:
        return <Catalog onSelect={handleSelectDashboard} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 overflow-hidden">
      {renderContent()}
    </div>
  );
};

export default App;