import React from 'react';
import { LayoutDashboard, Database, Cpu, ShieldCheck, Settings, HelpCircle, MessageSquareText, Zap, Layers } from 'lucide-react';

const sidebarTranslations = {
    en: {
        analysis: 'Data Gateway',
        dashboard: 'Core Intel',
        explorer: 'Business Grain',
        aiAdvisor: 'Strategic Chat',
        compliance: 'System Config',
        security: 'Security Protocol',
        docs: 'Documentation'
    },
    hi: {
        analysis: 'डेटा गेटवे',
        dashboard: 'कोर इंटेलिजेंस',
        explorer: 'व्यापार विवरण',
        aiAdvisor: 'रणनीतिक चैट',
        compliance: 'सिस्टम कॉन्फ़िगरेशन',
        security: 'सुरक्षा प्रोटोकॉल',
        docs: 'प्रलेखन'
    },
    ta: {
        analysis: 'தரவு நுழைவாயில்',
        dashboard: 'முக்கிய நுண்ணறிவு',
        explorer: 'வணிக விவரம்',
        aiAdvisor: 'மூலோபாய அரட்டை',
        compliance: 'கணினி கட்டமைப்பு',
        security: 'பாதுகாப்பு நெறிமுறை',
        docs: 'ஆவணப்படுத்தல்'
    }
};

const Sidebar = ({ activeTab, setActiveTab, isOpen, lang = 'en' }) => {
    const t = sidebarTranslations[lang] || sidebarTranslations.en;

    const menuItems = [
        { id: 'analysis', icon: <Database size={22} />, label: t.analysis },
        { id: 'dashboard', icon: <LayoutDashboard size={22} />, label: t.dashboard },
        { id: 'explorer', icon: <Layers size={22} />, label: t.explorer },
        { id: 'ai-advisor', icon: <MessageSquareText size={22} />, label: t.aiAdvisor },
        { id: 'compliance', icon: <Settings size={22} />, label: t.compliance },
    ];

    return (
        <div className={`sidebar ${isOpen ? 'mobile-visible' : ''}`}>
            <div className="logo" style={{ marginBottom: '4rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                    width: '45px',
                    height: '45px',
                    background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                    borderRadius: '1.2rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 0 20px rgba(56, 189, 248, 0.4)',
                    flexShrink: 0
                }}>
                    <Zap color="#000" size={26} fill="#000" />
                </div>
                <div>
                    <h2 style={{ fontSize: '1.4rem', fontWeight: 800, lineHeight: 1 }}>Fin<span className="gradient-text">Aura</span></h2>
                    <p style={{ fontSize: '0.6rem', color: 'var(--text-secondary)', letterSpacing: '2px', textTransform: 'uppercase', fontWeight: 800, marginTop: '3px' }}>ULTRA v3.3</p>
                </div>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map((item) => (
                    <div
                        key={item.id}
                        className={`nav-link ${activeTab === item.id ? 'active' : ''}`}
                        onClick={() => setActiveTab(item.id)}
                    >
                        {item.icon}
                        <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.label}</span>
                    </div>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', paddingTop: '2rem', borderTop: '1px solid var(--card-border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div className="nav-link">
                    <ShieldCheck size={20} />
                    <span style={{ fontSize: '0.85rem' }}>{t.security}</span>
                </div>
                <div className="nav-link">
                    <HelpCircle size={20} />
                    <span style={{ fontSize: '0.85rem' }}>{t.docs}</span>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .sidebar {
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 20px 0 50px rgba(0,0,0,0.5);
          }
          .sidebar.mobile-visible {
            transform: translateX(0);
          }
          .sidebar h2, .sidebar p, .sidebar span {
            display: block !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Sidebar;
