import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AIAssistant from './components/AIAssistant';
import AnalysisHub from './components/AnalysisHub';
import DataExplorer from './components/DataExplorer';
import { motion, AnimatePresence } from 'framer-motion';
import { Settings, Cpu, ShieldCheck, Sun, Moon, Menu, X, Globe, Check } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('analysis');
  const [businessData, setBusinessData] = useState(null);
  const [apiKey, setApiKey] = useState(localStorage.getItem('groq_api_key') || import.meta.env.VITE_GROQ_API_KEY || '');
  const [analysisResult, setAnalysisResult] = useState(null);
  const [theme, setTheme] = useState(localStorage.getItem('finaura-theme') || 'dark');
  const [lang, setLang] = useState(localStorage.getItem('finaura-lang') || 'en');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('finaura-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('finaura-lang', lang);
  }, [lang]);

  const toggleTheme = () => setTheme(prev => prev === 'dark' ? 'light' : 'dark');

  const handleDataUpdate = (data, result) => {
    setBusinessData(data);
    setAnalysisResult(result);
    if (data) setActiveTab('explorer');
  };

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard businessData={businessData} analysisResult={analysisResult} lang={lang} />;
      case 'explorer':
        return <DataExplorer businessData={businessData} lang={lang} />;
      case 'ai-advisor':
        return <AIAssistant businessData={businessData} apiKey={apiKey} lang={lang} />;
      case 'analysis':
        return <AnalysisHub onUpdate={handleDataUpdate} apiKey={apiKey} lang={lang} />;
      case 'compliance':
        return (
          <div style={{ maxWidth: '800px', margin: '4rem auto', padding: '0 1rem' }}>
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <div style={{ width: '60px', height: '60px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1rem', margin: '0 auto 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Globe size={30} color="var(--primary-color)" />
              </div>
              <h2 className="gradient-text" style={{ fontSize: '2rem' }}>System Localization</h2>
              <p style={{ marginTop: '0.5rem', color: 'var(--text-secondary)' }}>Select your preferred interface language.</p>

              <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {languages.map((l) => (
                  <div
                    key={l.code}
                    onClick={() => setLang(l.code)}
                    style={{
                      padding: '2rem 1rem',
                      borderRadius: '1.5rem',
                      border: '1px solid',
                      borderColor: lang === l.code ? 'var(--primary-color)' : 'var(--card-border)',
                      background: lang === l.code ? 'rgba(56, 189, 248, 0.05)' : 'rgba(255,255,255,0.02)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      position: 'relative'
                    }}
                  >
                    {lang === l.code && (
                      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
                        <Check size={16} color="var(--primary-color)" />
                      </div>
                    )}
                    <h3 style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{l.native}</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{l.label}</p>
                  </div>
                ))}
              </div>

              <div style={{ marginTop: '3rem', padding: '1.5rem', background: 'rgba(56, 189, 248, 0.03)', borderRadius: '1.5rem', border: '1px solid var(--card-border)', textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <ShieldCheck size={20} color="var(--success)" />
                  <p style={{ fontSize: '0.9rem', fontWeight: 600 }}>Engine Security</p>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                  The AI Uplink API is securely configured and active in the background. System tokens are managed automatically.
                </p>
              </div>
            </div>
          </div>
        );
      default:
        return <AnalysisHub onUpdate={handleDataUpdate} apiKey={apiKey} lang={lang} />;
    }
  };

  return (
    <div className="app-container">
      <div className="ai-glow" style={{ top: '-10%', left: '-10%' }} />
      <div className="ai-glow" style={{ bottom: '-10%', right: '-10%', background: 'radial-gradient(circle, rgba(129, 140, 248, 0.1) 0%, transparent 70%)' }} />

      <div className="top-nav-actions" style={{ position: 'fixed', top: '1.5rem', right: '1.5rem', zIndex: 100, display: 'flex', gap: '1rem' }}>
        <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle Theme" style={{ position: 'static' }}>
          {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button className="theme-toggle mobile-only" onClick={() => setIsSidebarOpen(!isSidebarOpen)} style={{ position: 'static' }}>
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <Sidebar activeTab={activeTab} setActiveTab={(tab) => { setActiveTab(tab); setIsSidebarOpen(false) }} isOpen={isSidebarOpen} lang={lang} />

      <main className={`main-container ${isSidebarOpen ? 'blur' : ''}`}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          >
            {renderContent()}
          </motion.div>
        </AnimatePresence>
      </main>

      <style>{`
        .mobile-only { display: none; }
        @media (max-width: 1024px) {
           .mobile-only { display: flex; }
           .main-container.blur { filter: blur(4px); pointer-events: none; }
        }
      `}</style>
    </div >
  );
}

export default App;
