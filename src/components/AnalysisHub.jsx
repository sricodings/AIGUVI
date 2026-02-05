import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Database, Loader2, CheckCircle2, AlertCircle, Trash2, FileSpreadsheet, Zap } from 'lucide-react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';
import { analyzeDynamicFinancials } from '../utils/aiService';
import { motion, AnimatePresence } from 'framer-motion';

const gatewayTranslations = {
    en: {
        title: 'Data Gateway',
        subtitle: 'Seamless ingestion for Excel, CSV, and JSON. FinAura AI will automatically map and synthesize your business grain.',
        drag: 'Refresh Data Stream',
        deploy: 'Deploy Financials',
        dragHint: 'Drag and drop your spreadsheet here.',
        engine: 'Synthesis Engine',
        idle: 'Engine idle. Establishing connection parameters...',
        processing: 'MAPPING RECURSION...',
        analyzing: (file) => `Structuring ${file} for strategic audit.`,
        fault: 'SYSTEM FAULT',
        retry: 'Re-Initialise',
        secured: 'UPLINK SECURED',
        records: (len, file) => `${len} records synthesized from ${file}`,
        currentFlow: 'Current Flow',
        flowDesc: 'Data has been converted to Business Grain. Your business metrics are ready for deep forensic exploration.',
        refresh: 'Refresh Intelligence',
        demo: 'Load Demo Dataset'
    },
    hi: {
        title: 'डेटा गेटवे',
        subtitle: 'एक्सेल, सीएसवी और जेसन के लिए निर्बाध प्रवेश। FinAura AI स्वचालित रूप से आपके व्यापार विवरण को मैप और संश्लेषित करेगा।',
        drag: 'डेटा स्ट्रीम रीफ्रेश करें',
        deploy: 'वित्तीय डेटा तैनात करें',
        dragHint: 'अपनी स्प्रेडशीट को यहाँ खींचें और छोड़ें।',
        engine: 'संश्लेषण इंजन',
        idle: 'इंजन निष्क्रिय। कनेक्शन पैरामीटर स्थापित कर रहा है...',
        processing: 'मैपिंग रिकर्सन...',
        analyzing: (file) => `रणनीतिक ऑडिट के लिए ${file} की संरचना।`,
        fault: 'सिस्टम फॉल्ट',
        retry: 'पुन: प्रारंभ करें',
        secured: 'अपलिंक सुरक्षित',
        records: (len, file) => `${len} रिकॉर्ड ${file} से संश्लेषित`,
        currentFlow: 'वर्तमान प्रवाह',
        flowDesc: 'डेटा को व्यापार अनाज में परिवर्तित कर दिया गया है। आपके व्यावसायिक मेट्रिक्स गहन फोरेंसिक अन्वेषण के लिए तैयार हैं।',
        refresh: 'इंटेलिजेंस रीफ्रेश करें',
        demo: 'डेमो डेटासेट लोड करें'
    },
    ta: {
        title: 'தரவு நுழைவாயில்',
        subtitle: 'Excel, CSV மற்றும் JSON க்கான தடையற்ற உள்வாங்கல். FinAura AI தானாகவே உங்கள் வணிகத் தரவை வரைபடமாக்கி ஒருங்கிணைக்கும்.',
        drag: 'தரவு ஓட்டத்தைப் புதுப்பிக்கவும்',
        deploy: 'நிதியியல் தரவை வரிசைப்படுத்தவும்',
        dragHint: 'உங்கள் விரிதாளை இங்கே இழுத்து விடுங்கள்.',
        engine: 'ஒருங்கிணைப்பு இயந்திரம்',
        idle: 'இயந்திரம் செயலற்ற நிலையில் உள்ளது. இணைப்பு அளவுருக்களை நிறுவுகிறது...',
        processing: 'வரைபடமாக்கல் மறுநிகழ்வு...',
        analyzing: (file) => `மூலோபாய தணிக்கைக்காக ${file}-ஐ வடிவமைக்கிறது.`,
        fault: 'கணினி பிழை',
        retry: 'மீண்டும் தொடங்கவும்',
        secured: 'அப்லிங்க் பாதுகாப்பானது',
        records: (len, file) => `${file}-லிருந்து ${len} பதிவுகள் ஒருங்கிணைக்கப்பட்டன`,
        currentFlow: 'தற்போதைய ஓட்டம்',
        flowDesc: 'தரவு வணிக விவரமாக மாற்றப்பட்டுள்ளது. உங்கள் வணிக அளவீடுகள் ஆழமான தடயவியல் ஆய்வுக்கு தயாராக உள்ளன.',
        refresh: 'நுண்ணறிவைப் புதுப்பிக்கவும்',
        demo: 'மாதிரித் தரவை ஏற்றவும்'
    }
};

const AnalysisHub = ({ onUpdate, apiKey, lang = 'en' }) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [localData, setLocalData] = useState(null);
    const [error, setError] = useState(null);
    const [fileName, setFileName] = useState('');
    const t = gatewayTranslations[lang] || gatewayTranslations.en;

    const demoData = [
        { Date: '2025-01-05', Client: 'ABC Retail', Revenue_Stream: 'Product Sales', Amount_INR: 120000 },
        { Date: '2025-01-10', Client: 'XYZ Traders', Revenue_Stream: 'Wholesale', Amount_INR: 85000 },
        { Date: '2025-01-18', Client: 'Online Store', Revenue_Stream: 'E-commerce', Amount_INR: 45000 },
        { Date: '2025-02-03', Client: 'ABC Retail', Revenue_Stream: 'Product Sales', Amount_INR: 150000 },
        { Date: '2025-02-20', Client: 'Corporate Corp', Revenue_Stream: 'Bulk Order', Amount_INR: 200000 },
        { Date: '2025-03-05', Client: 'XYZ Traders', Revenue_Stream: 'Wholesale', Amount_INR: 95000 },
        { Date: '2025-03-12', Client: 'Global Tech', Revenue_Stream: 'Consulting', Amount_INR: 320000 },
        { Date: '2025-03-25', Client: 'Online Store', Revenue_Stream: 'E-commerce', Amount_INR: 55000 },
        { Date: '2025-04-02', Client: 'ABC Retail', Revenue_Stream: 'Product Sales', Amount_INR: 180000 },
        { Date: '2025-04-15', Client: 'Mega Mall', Revenue_Stream: 'Retail', Amount_INR: 410000 }
    ];

    const loadDemo = () => {
        setFileName('FinAura_Demo_Dataset.xlsx');
        setLocalData(demoData);
        processData(demoData);
    };

    const processData = async (rawData) => {
        if (!apiKey) {
            setError("Security Protocol: AI Key Required. Please update in System Config.");
            return;
        }

        setIsProcessing(true);
        setError(null);

        try {
            const result = await analyzeDynamicFinancials(rawData.slice(0, 100), apiKey, 'full_audit');
            onUpdate(rawData, result);
        } catch (err) {
            setError("Protocol Fault: Data structure incompatible with AI Synthesis engine.");
        } finally {
            setIsProcessing(false);
        }
    };

    const onDrop = useCallback(async (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (!file) return;

        setFileName(file.name);
        const extension = file.name.split('.').pop().toLowerCase();

        const handleResult = (data) => {
            setLocalData(data);
            processData(data);
        };

        if (extension === 'csv') {
            Papa.parse(file, {
                header: true, skipEmptyLines: true,
                complete: (results) => handleResult(results.data)
            });
        } else if (extension === 'xlsx' || extension === 'xls') {
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                const ws = workbook.Sheets[workbook.SheetNames[0]];
                handleResult(XLSX.utils.sheet_to_json(ws));
            };
            reader.readAsArrayBuffer(file);
        } else if (extension === 'json') {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const json = JSON.parse(e.target.result);
                    handleResult(Array.isArray(json) ? json : [json]);
                } catch { setError("Invalid Schema: JSON parsing failure."); }
            };
            reader.readAsText(file);
        }
    }, [apiKey]);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop, multiple: false,
        accept: {
            'text/csv': ['.csv'],
            'application/json': ['.json'],
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
            'application/vnd.ms-excel': ['.xls']
        }
    });

    return (
        <div className="analysis-hub">
            <header style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '3.5rem', fontWeight: 800 }} className="gradient-text">{t.title}</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '600px' }}>
                    {t.subtitle}
                </p>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2.5rem' }}>
                <div className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: isDragActive ? '2px solid var(--primary-color)' : '1px solid var(--card-border)' }}>
                    <div {...getRootProps()} style={{
                        height: '100%', minHeight: '450px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                        cursor: 'pointer', padding: '3rem',
                        background: isDragActive ? 'rgba(56, 189, 248, 0.05)' : 'transparent'
                    }}>
                        <input {...getInputProps()} />
                        <div style={{
                            width: '120px', height: '120px',
                            background: 'rgba(56, 189, 248, 0.1)',
                            borderRadius: '2.5rem',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            marginBottom: '2.5rem',
                            boxShadow: '0 0 40px rgba(56, 189, 248, 0.1)'
                        }}>
                            <FileSpreadsheet size={50} color="var(--primary-color)" />
                        </div>
                        <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem' }}>{localData ? t.drag : t.deploy}</h2>
                        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', fontWeight: 500 }}>
                            {t.dragHint}
                        </p>
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '3rem', background: 'rgba(255,255,255,0.01)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
                        <Zap color="var(--primary-color)" fill="var(--primary-color)" size={24} />
                        <h3 style={{ fontSize: '1.5rem' }}>{t.engine}</h3>
                    </div>

                    <AnimatePresence mode="wait">
                        {!localData && !isProcessing && !error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{ height: '2px', background: 'var(--card-border)', width: '100%' }} />
                                <p style={{ color: 'var(--text-secondary)' }}>{t.idle}</p>
                                <button
                                    onClick={loadDemo}
                                    className="btn-ai"
                                    style={{
                                        marginTop: '1rem',
                                        background: 'rgba(56, 189, 248, 0.1)',
                                        color: 'var(--primary-color)',
                                        border: '1px solid rgba(56, 189, 248, 0.2)'
                                    }}
                                >
                                    <Database size={18} style={{ marginRight: '0.5rem' }} />
                                    {t.demo}
                                </button>
                            </motion.div>
                        )}

                        {isProcessing && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ textAlign: 'center', padding: '2rem' }}>
                                <Loader2 className="spin" size={60} color="var(--primary-color)" style={{ margin: '0 auto 2rem' }} />
                                <h4 className="gradient-text" style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t.processing}</h4>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '1rem' }}>{t.analyzing(fileName)}</p>
                            </motion.div>
                        )}

                        {error && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ padding: '2rem', background: 'rgba(239, 68, 68, 0.05)', borderRadius: '1.5rem', border: '1px solid var(--error)' }}>
                                <AlertCircle color="var(--error)" size={32} />
                                <h4 style={{ color: 'var(--error)', marginTop: '1.5rem', fontSize: '1.2rem' }}>{t.fault}</h4>
                                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{error}</p>
                                <button onClick={() => setError(null)} className="btn-ai" style={{ marginTop: '2rem', width: '100%', background: 'var(--error)' }}>{t.retry}</button>
                            </motion.div>
                        )}

                        {localData && !isProcessing && !error && (
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                                <div style={{ padding: '2rem', background: 'rgba(34, 197, 94, 0.05)', borderRadius: '1.5rem', border: '1px solid var(--success)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontWeight: 800, color: 'var(--success)', fontSize: '1.2rem' }}>{t.secured}</p>
                                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{t.records(localData.length, fileName)}</p>
                                    </div>
                                    <button onClick={() => { setLocalData(null); onUpdate(null, null) }} style={{ color: 'var(--error)', background: 'transparent', border: 'none', cursor: 'pointer' }}>
                                        <Trash2 size={24} />
                                    </button>
                                </div>

                                <div style={{ padding: '2rem', background: 'var(--card-bg)', borderRadius: '1.5rem', border: '1px solid var(--card-border)' }}>
                                    <p style={{ color: 'var(--primary-color)', fontWeight: 800, fontSize: '0.8rem', textTransform: 'uppercase' }}>{t.currentFlow}</p>
                                    <p style={{ marginTop: '1rem', fontSize: '1.1rem', lineHeight: 1.6 }}>{t.flowDesc}</p>
                                </div>

                                <button className="btn-ai" style={{ width: '100%', height: '60px', borderRadius: '1.2rem', justifyContent: 'center', fontSize: '1rem' }} onClick={() => processData(localData)}>
                                    {t.refresh}
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>

            <style>{`
                .spin { animation: spin 2s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default AnalysisHub;
