import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell
} from 'recharts';
import { Shield, Zap, Target, TrendingUp, AlertTriangle, Cpu, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import ForensicReport from './ForensicReport';

const dashboardTranslations = {
    en: {
        title: 'FinAura Intelligence',
        subtitle: (len) => `Dynamic synthesis of ${len} data points.`,
        fidelity: 'AI FIDELITY',
        idleTitle: 'Engine Idle',
        idleDesc: 'FinAura Ultra requires a data stream to initialize. Please upload financial records in the Data Gateway section.',
        healthCore: 'Health Core',
        riskDensity: 'Risk Density',
        markers: 'MARKERS',
        actionTargets: 'Action Targets',
        optimized: 'OPTIMIZED',
        integrity: 'Data Integrity',
        neuralMap: 'AI Insight Neural Map',
        responses: 'Critical Responses',
        live: 'LIVE'
    },
    hi: {
        title: 'FinAura इंटेलिजेंस',
        subtitle: (len) => `${len} डेटा बिंदुओं का गतिशील संश्लेषण।`,
        fidelity: 'AI निष्ठा',
        idleTitle: 'इंजन निष्क्रिय',
        idleDesc: 'FinAura Ultra को प्रारंभ करने के लिए डेटा स्ट्रीम की आवश्यकता है। कृपया डेटा गेटवे अनुभाग में वित्तीय रिकॉर्ड अपलोड करें।',
        healthCore: 'स्वास्थ्य कोर',
        riskDensity: 'जोखिम घनत्व',
        markers: 'चिन्हक',
        actionTargets: 'कार्रवाई लक्ष्य',
        optimized: 'अनुकूलित',
        integrity: 'डेटा अखंडता',
        neuralMap: 'AI अंतर्दृष्टि न्यूरल मैप',
        responses: 'महत्वपूर्ण प्रतिक्रियाएं',
        live: 'सक्रिय'
    },
    ta: {
        title: 'FinAura நுண்ணறிவு',
        subtitle: (len) => `${len} தரவுப் புள்ளிகளின் மாறும் தொகுப்பு.`,
        fidelity: 'AI நம்பகத்தன்மை',
        idleTitle: 'இயந்திரம் செயலில் இல்லை',
        idleDesc: 'FinAura Ultra தொடங்குவதற்கு ஒரு தரவு ஓட்டம் தேவை. தரவு நுழைவாயில் பிரிவில் நிதியியல் பதிவுகளைப் பதிவேற்றவும்.',
        healthCore: 'சுகாதார மையம்',
        riskDensity: 'அபாய அடர்த்தி',
        markers: 'குறியீடுகள்',
        actionTargets: 'நடவடிக்கை இலக்குகள்',
        optimized: 'உகந்ததாக உள்ளது',
        integrity: 'தரவு ஒருமைப்பாடு',
        neuralMap: 'AI நுண்ணறிவு நியூரல் வரைபடம்',
        responses: 'முக்கியமான பதில்கள்',
        live: 'நேரலை'
    }
};

const Dashboard = ({ businessData, analysisResult, lang = 'en' }) => {
    const t = dashboardTranslations[lang] || dashboardTranslations.en;

    if (!businessData || !analysisResult) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div style={{
                        width: '120px', height: '120px', background: 'rgba(56, 189, 248, 0.1)',
                        borderRadius: '50%', margin: '0 auto 2rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Cpu size={60} color="var(--primary-color)" />
                    </div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }} className="gradient-text">{t.idleTitle}</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto' }}>
                        {t.idleDesc}
                    </p>
                </motion.div>
            </div>
        );
    }

    const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#22c55e', '#ef4444'];

    return (
        <div className="dashboard-content">
            <header style={{ marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 800 }}>{t.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{t.subtitle(businessData.length)}</p>
                </div>
                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <ForensicReport businessData={businessData} analysisResult={analysisResult} lang={lang} />
                    <div className="glass-panel" style={{ padding: '1rem 2rem', background: 'rgba(56, 189, 248, 0.05)', borderColor: 'var(--primary-color)' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--primary-color)', fontWeight: 700 }}>{t.fidelity}</p>
                        <p style={{ fontSize: '1.5rem', fontWeight: 800 }}>ULTRA 3.3</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                        <Zap size={24} color="var(--primary-color)" />
                        <span style={{ color: 'var(--success)', fontSize: '0.8rem', fontWeight: 700 }}>{t.live}</span>
                    </div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{t.healthCore}</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800, color: analysisResult.score > 70 ? 'var(--success)' : 'var(--warning)' }}>
                        {analysisResult.score}%
                    </h2>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <Shield size={24} color="var(--secondary-color)" />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>{t.riskDensity}</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                        {analysisResult.alerts.length} <span style={{ fontSize: '0.9rem', color: 'var(--error)' }}>{t.markers}</span>
                    </h2>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <Target size={24} color="var(--accent-color)" />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>{t.actionTargets}</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>
                        {analysisResult.recommendations.length} <span style={{ fontSize: '0.9rem', color: 'var(--primary-color)' }}>{t.optimized}</span>
                    </h2>
                </motion.div>

                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="glass-panel" style={{ padding: '2rem' }}>
                    <Cpu size={24} color="var(--primary-color)" />
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '1rem' }}>{t.integrity}</p>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 800 }}>100%</h2>
                </motion.div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '450px' }}>
                    <h3 style={{ marginBottom: '2rem' }}>{t.neuralMap}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        {analysisResult.findings.map((f, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ x: -20, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ delay: idx * 0.1 }}
                                style={{
                                    padding: '1.5rem', background: 'rgba(255,255,255,0.02)',
                                    borderRadius: '1rem', borderLeft: `4px solid ${COLORS[idx % 5]}`,
                                    display: 'flex', gap: '1.5rem', alignItems: 'center'
                                }}
                            >
                                <div style={{ fontSize: '1.2rem', fontWeight: 800, opacity: 0.3 }}>0{idx + 1}</div>
                                <p style={{ fontSize: '1.05rem', lineHeight: '1.6' }}>{f}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '2.5rem' }}>
                    <h3 style={{ marginBottom: '2rem' }}>{t.responses}</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {analysisResult.recommendations.map((rec, idx) => (
                            <div key={idx} style={{
                                padding: '1.5rem',
                                background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.05), transparent)',
                                borderRadius: '1rem',
                                border: '1px solid var(--card-border)'
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <h4 style={{ color: 'var(--primary-color)' }}>{rec.title}</h4>
                                    <span style={{ fontSize: '0.7rem', fontWeight: 700, padding: '0.2rem 0.6rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '1rem' }}>
                                        {rec.impact}
                                    </span>
                                </div>
                                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>{rec.description}</p>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>
                                    {rec.action} <ArrowRight size={14} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
