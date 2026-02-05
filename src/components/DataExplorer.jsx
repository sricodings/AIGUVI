import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Search, Info, BarChart, Zap, ChevronRight, Table } from 'lucide-react';

const translations = {
    en: {
        title: "Business Grain",
        subtitle: "Slicing through records with forensic precision.",
        search: "Search across all parameters...",
        record: "EXCEL ROW",
        hover: "View Full Row Details",
        spectral: "FORENSIC ROW DATA",
        verity: "DATA INTEGRITY",
        empty: "Establish a data stream in the Data Gateway."
    },
    hi: {
        title: "व्यापार अनाज",
        subtitle: "न्यायकि परिशुद्धता के साथ रिकॉर्ड का विश्लेषण।",
        search: "सभी मापदंडों में खोजें...",
        record: "एक्सेल पंक्ति",
        hover: "पूरी पंक्ति का विवरण देखें",
        spectral: "फॉरेंसिक पंक्ति डेटा",
        verity: "डेटा अखंडता",
        empty: "डेटा गेटवे में डेटा स्ट्रीम स्थापित करें।"
    },
    ta: {
        title: "வணிக தானியம்",
        subtitle: "தடயவியல் துல்லியத்துடன் பதிவுகளை பகுப்பாய்வு செய்தல்.",
        search: "அனைத்து அளவுருக்களிலும் தேடுங்கள்...",
        record: "எக்செல் வரிசை",
        hover: "முழு வரிசை விவரங்களைக் காண்க",
        spectral: "தடயவியல் வரிசை தரவு",
        verity: "தரவு ஒருமைப்பாடு",
        empty: "தரவு நுழைவாயிலில் தரவு ஓட்டத்தை நிறுவவும்."
    }
};

const DataExplorer = ({ businessData, lang = 'en' }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const t = translations[lang] || translations.en;

    const filteredData = useMemo(() => {
        if (!businessData) return [];
        if (!searchTerm) return businessData;
        return businessData.filter(record =>
            Object.values(record).some(val =>
                String(val).toLowerCase().includes(searchTerm.toLowerCase())
            )
        );
    }, [businessData, searchTerm]);

    if (!businessData || businessData.length === 0) {
        return (
            <div style={{ padding: '8rem 2rem', textAlign: 'center' }}>
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                    <div style={{
                        width: '120px', height: '120px', background: 'rgba(56, 189, 248, 0.1)',
                        borderRadius: '50%', margin: '0 auto 2rem', display: 'flex',
                        alignItems: 'center', justifyContent: 'center'
                    }}>
                        <Table size={60} color="var(--primary-color)" />
                    </div>
                    <h1 style={{ fontSize: '3rem', marginBottom: '1rem' }} className="gradient-text">{t.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', margin: '0 auto', fontSize: '1.2rem' }}>
                        {t.empty}
                    </p>
                </motion.div>
            </div>
        );
    }

    const keys = Object.keys(businessData[0]);

    return (
        <div className="data-explorer">
            <header style={{ marginBottom: '4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '2rem' }}>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)', fontWeight: 800 }} className="gradient-text">{t.title}</h1>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem', fontSize: '1.2rem' }}>
                        {t.subtitle} ({businessData.length} records)
                    </p>
                </div>
                <div style={{ position: 'relative', minWidth: '320px' }}>
                    <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', opacity: 0.4 }} size={20} />
                    <input
                        placeholder={t.search}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '3rem', background: 'var(--card-bg)', borderRadius: '1.2rem', height: '60px' }}
                    />
                </div>
            </header>

            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr',
                gap: '1.5rem'
            }}>
                {filteredData.slice(0, 30).map((record, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="glass-panel excel-card"
                        style={{
                            padding: '1.5rem',
                            position: 'relative',
                            overflow: 'hidden',
                            display: 'flex',
                            flexDirection: 'column',
                            cursor: 'pointer'
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem', borderBottom: '1px solid var(--card-border)', paddingBottom: '1rem' }}>
                            <div style={{ padding: '0.5rem', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.5rem' }}>
                                <Table size={18} color="var(--primary-color)" />
                            </div>
                            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary-color)', letterSpacing: '1px' }}>
                                {t.record} #{index + 1}
                            </span>
                        </div>

                        {/* Excel-like Row Display */}
                        <div style={{
                            display: 'flex',
                            gap: '1.5rem',
                            overflowX: 'auto',
                            paddingBottom: '0.5rem',
                            scrollBehavior: 'smooth'
                        }} className="hide-scrollbar">
                            {keys.map((k, i) => {
                                const val = record[k];
                                const isHighlighted = !isNaN(parseFloat(val)) && parseFloat(val) > 10000;
                                return (
                                    <div key={i} style={{ minWidth: '150px', flexShrink: 0 }}>
                                        <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', marginBottom: '0.3rem', fontWeight: 800 }}>{k}</p>
                                        <p style={{
                                            fontSize: '0.95rem',
                                            fontWeight: 600,
                                            color: isHighlighted ? 'var(--primary-color)' : 'var(--text-primary)',
                                            background: isHighlighted ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                                            padding: isHighlighted ? '4px 8px' : '0',
                                            borderRadius: '4px',
                                            width: 'fit-content'
                                        }}>
                                            {String(val)}
                                        </p>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Hover Overlay for Perfect Analysis */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            style={{
                                position: 'absolute', inset: 0,
                                background: 'var(--sidebar-bg)',
                                padding: '1.5rem', zIndex: 5,
                                display: 'flex', alignItems: 'center',
                                justifyContent: 'space-between',
                                border: '2px solid var(--primary-color)',
                                borderRadius: '1.5rem',
                                backdropFilter: 'blur(8px)'
                            }}
                        >
                            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ textAlign: 'left' }}>
                                    <h4 style={{ color: 'var(--primary-color)', fontSize: '0.9rem', fontWeight: 800 }}>{t.spectral}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.3rem' }}>{t.hover}</p>
                                </div>
                                <div style={{ height: '40px', width: '1px', background: 'var(--card-border)' }} />
                                <div style={{ textAlign: 'left' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--success)', fontWeight: 800, fontSize: '0.8rem' }}>
                                        <Zap size={14} fill="var(--success)" /> {t.verity}: 100%
                                    </div>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Forensic Sync Verified</p>
                                </div>
                            </div>
                            <ChevronRight color="var(--primary-color)" />
                        </motion.div>
                    </motion.div>
                ))}
            </div>

            <style>{`
                .hide-scrollbar::-webkit-scrollbar { display: none; }
                .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
                .excel-card:hover { border-color: var(--primary-color); }
            `}</style>
        </div>
    );
};

export default DataExplorer;
