import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { AuthModal } from './components/AuthModal';
import { ErrorBoundary } from './components/ErrorBoundary';
import { HomePage } from './pages/HomePage';
import { RoutePlannerPage } from './pages/RoutePlannerPage';
import { MyRoutesPage } from './pages/MyRoutesPage';
import { AdventureMapPage } from './pages/AdventureMapPage';
import { useAuth } from './contexts/AuthContext';

const AppContent: React.FC = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const { user } = useAuth();

  return (
    <ErrorBoundary>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Header 
            user={user} 
            onAuthClick={() => setShowAuthModal(true)} 
          />
          
          <main>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/adventure-map" element={<AdventureMapPage />} />
              <Route path="/planner" element={<RoutePlannerPage />} />
              <Route path="/my-routes" element={<MyRoutesPage />} />
            </Routes>
          </main>

          <AuthModal 
            isOpen={showAuthModal}
            onClose={() => setShowAuthModal(false)}
          />
        </div>
      </Router>
    </ErrorBoundary>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;