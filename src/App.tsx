import { useEffect, useState } from 'react';
import { HashRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { useAppStore } from './store/store';
import { ToastProvider } from './components/Toast';
import Dashboard from './pages/Dashboard';
import ToolPage from './pages/ToolPage';
import LoadingIndicator from './components/LoadingIndicator';
import SplashScreen from './components/SplashScreen';
import './App.css';

const AppRoutes = () => {
  const location = useLocation();
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    setIsNavigating(true);
    const timeout = window.setTimeout(() => setIsNavigating(false), 250);
    return () => window.clearTimeout(timeout);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground transition-colors duration-300">
      <LoadingIndicator visible={isNavigating} />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tool/:toolId" element={<ToolPage />} />
      </Routes>
    </div>
  );
};

function App() {
  const theme = useAppStore((state) => state.theme);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const timeout = window.setTimeout(() => setIsReady(true), 2000);
    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  if (!isReady) {
    return <SplashScreen />;
  }

  return (
    <div className={`${theme === 'dark' ? 'dark' : ''} min-h-screen`}>
      <div className="bg-background text-foreground">
        <ToastProvider>
          <Router>
            <AppRoutes />
          </Router>
        </ToastProvider>
      </div>
    </div>
  );
}

export default App;