import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Sparkles, Cpu, Layers, Terminal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { chatWithIntelligence } from '../utils/aiService';

const assistantTranslations = {
    en: {
        title: 'Neural Advisor',
        status: 'ACTIVE',
        online: 'SYNAPSE ONLINE',
        offline: 'UPLINK OFFLINE',
        placeholder: 'Ask me anything about your data...',
        awaiting: 'Awaiting data uplink...',
        contextTitle: 'Neural Context',
        insightTitle: 'Dataset Insight',
        welcome: (len, keys) => `FinAura Intelligence Link Established. I have successfully synthesized your ${len} data points. I am ready to provide forensic-level strategic counsel. What area of your ${keys} would you like to deep-dive into?`,
        pending: "Neural Uplink Pending. Please feed the engine with data in the Data Gateway section to activate high-fidelity reasoning."
    },
    hi: {
        title: 'न्यूरल सलाहकार',
        status: 'सक्रिय',
        online: 'सिनैप्स ऑनलाइन',
        offline: 'अपलिंक ऑफलाइन',
        placeholder: 'अपने डेटा के बारे में कुछ भी पूछें...',
        awaiting: 'डेटा अपलिंक की प्रतीक्षा है...',
        contextTitle: 'न्यूरल संदर्भ',
        insightTitle: 'डेटासेट अंतर्दृष्टि',
        welcome: (len, keys) => `FinAura इंटेलिजेंस लिंक स्थापित। मैंने आपके ${len} डेटा बिंदुओं को सफलतापूर्वक संश्लेषित किया है। मैं फोरेंसिक-स्तर की रणनीतिक सलाह देने के लिए तैयार हूं। आप अपने ${keys} के किस क्षेत्र में गहरा गोता लगाना चाहेंगे?`,
        pending: "न्यूरल अपलिंक लंबित है। उच्च-निष्ठा तर्क को सक्रिय करने के लिए कृपया डेटा गेटवे अनुभाग में डेटा के साथ इंजन को फीड करें।"
    },
    ta: {
        title: 'நியூரல் ஆலோசகர்',
        status: 'செயலில் உள்ளது',
        online: 'சினாப்ஸ் ஆன்லைன்',
        offline: 'அப்லிங்க் ஆஃப்லைன்',
        placeholder: 'உங்கள் தரவைப் பற்றி எதையும் கேளுங்கள்...',
        awaiting: 'தரவு இணைப்பிற்காக காத்திருக்கிறது...',
        contextTitle: 'நியூரல் சூழல்',
        insightTitle: 'தரவுத்தொகுப்பு நுண்ணறிவு',
        welcome: (len, keys) => `FinAura நுண்ணறிவு இணைப்பு நிறுவப்பட்டது. உங்கள் ${len} தரவுப் புள்ளிகளை நான் வெற்றிகரமாக ஒருங்கிணைத்துள்ளேன். தடயவியல் நிலை மூலோபாய ஆலோசனைகளை வழங்க நான் தயாராக உள்ளேன். உங்கள் ${keys} இன் எந்தப் பகுதியில் நீங்கள் ஆழமாக ஆராய விரும்புகிறீர்கள்?`,
        pending: "நியூரல் இணைப்பு நிலுவையில் உள்ளது. உயர்நிலை பகுப்பாய்வைச் செயல்படுத்த தரவு நுழைவாயில் பிரிவில் தரவை உள்ளிடவும்."
    }
};

const AIAssistant = ({ businessData, apiKey, lang = 'en' }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const t = assistantTranslations[lang] || assistantTranslations.en;

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    useEffect(() => {
        if (businessData && messages.length === 0) {
            const keys = businessData.length > 0 ? Object.keys(businessData[0]).join(', ') : 'financials';
            setMessages([{
                role: 'assistant',
                content: t.welcome(businessData.length, keys)
            }]);
        } else if (!businessData && messages.length === 0) {
            setMessages([{
                role: 'assistant',
                content: t.pending
            }]);
        }
    }, [businessData, lang]);

    const handleSend = async () => {
        if (!input.trim() || !apiKey) return;

        const newMessages = [...messages, { role: 'user', content: input }];
        setMessages(newMessages);
        setInput('');
        setIsTyping(true);

        try {
            const response = await chatWithIntelligence(newMessages, businessData, apiKey);
            setMessages([...newMessages, { role: 'assistant', content: response }]);
        } catch (error) {
            setMessages([...newMessages, { role: 'assistant', content: "Protocol Fault. Re-authenticate in System Config." }]);
        } finally {
            setIsTyping(false);
        }
    };

    return (
        <div className="ai-advisor-layout" style={{ height: 'calc(100vh - 180px)', display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '2rem' }}>
            <div className="glass-panel" style={{ display: 'flex', flexDirection: 'column', padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid var(--card-border)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ width: '40px', height: '40px', background: 'rgba(56, 189, 248, 0.1)', borderRadius: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Terminal size={20} color="var(--primary-color)" />
                        </div>
                        <div>
                            <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{t.title}</h3>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', fontWeight: 600 }}>LLAMA-3.3-CORE {t.status}</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: apiKey ? 'var(--success)' : 'var(--error)', fontSize: '0.7rem', fontWeight: 800, background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.8rem', borderRadius: '2rem' }}>
                        <motion.div animate={{ opacity: [1, 0.4, 1] }} transition={{ repeat: Infinity, duration: 2 }} style={{ width: '6px', height: '6px', background: 'currentColor', borderRadius: '50%' }} />
                        {apiKey ? t.online : t.offline}
                    </div>
                </div>

                <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <AnimatePresence initial={false}>
                        {messages.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95, y: 10 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                style={{
                                    display: 'flex', gap: '1rem',
                                    flexDirection: m.role === 'user' ? 'row-reverse' : 'row',
                                    alignItems: 'flex-start'
                                }}
                            >
                                <div style={{
                                    width: '32px', height: '32px', borderRadius: '0.6rem',
                                    background: m.role === 'user' ? 'var(--secondary-color)' : 'rgba(56, 189, 248, 0.15)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                                    marginTop: '4px'
                                }}>
                                    {m.role === 'user' ? <User size={18} color="#fff" /> : <Bot size={18} color="var(--primary-color)" />}
                                </div>
                                <div style={{
                                    maxWidth: '85%', padding: '1rem 1.25rem', borderRadius: '1.25rem',
                                    background: m.role === 'user' ? 'var(--primary-color)' : 'rgba(255,255,255,0.03)',
                                    color: (m.role === 'user' && typeof theme !== 'undefined' && theme === 'light') ? '#fff' : (m.role === 'user' ? '#000' : 'var(--text-primary)'),
                                    fontSize: '0.95rem', lineHeight: '1.6',
                                    borderTopRightRadius: m.role === 'user' ? '0.2rem' : '1.25rem',
                                    borderTopLeftRadius: m.role === 'assistant' ? '0.2rem' : '1.25rem',
                                    boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
                                    border: m.role === 'assistant' ? '1px solid var(--card-border)' : 'none'
                                }}>
                                    {m.content}
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                    {isTyping && (
                        <div style={{ display: 'flex', gap: '0.4rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', width: 'fit-content', borderRadius: '1rem', marginLeft: '2.5rem' }}>
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }} style={{ width: '4px', height: '4px', background: 'var(--primary-color)', borderRadius: '50%' }} />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} style={{ width: '4px', height: '4px', background: 'var(--primary-color)', borderRadius: '50%' }} />
                            <motion.div animate={{ opacity: [0.3, 1, 0.3] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} style={{ width: '4px', height: '4px', background: 'var(--primary-color)', borderRadius: '50%' }} />
                        </div>
                    )}
                </div>

                <div style={{ padding: '1.5rem', borderTop: '1px solid var(--card-border)', background: 'rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={businessData ? t.placeholder : t.awaiting}
                            disabled={!businessData || !apiKey || isTyping}
                            style={{ flex: 1, background: 'rgba(255,255,255,0.03)', border: '1px solid var(--card-border)', padding: '0.875rem 1.25rem', color: '#fff', borderRadius: '0.75rem', fontSize: '0.95rem' }}
                        />
                        <button
                            onClick={handleSend}
                            className="btn-ai"
                            disabled={!input.trim() || !apiKey || isTyping}
                            style={{ padding: '0 1.5rem', height: '48px' }}
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="knowledge-sidebar" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="glass-panel" style={{ padding: '1.5rem' }}>
                    <h4 style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.9rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                        <Layers size={16} color="var(--primary-color)" /> {t.contextTitle}
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {['Data Forensic Engine', 'Strategy Synthesizer', 'Compliance Guardian'].map((kb, idx) => (
                            <div key={idx} style={{ padding: '0.8rem 1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', fontSize: '0.8rem', border: '1px solid var(--card-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ color: 'var(--text-secondary)' }}>{kb}</span>
                                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: businessData ? 'var(--success)' : 'rgba(255,255,255,0.1)' }} />
                            </div>
                        ))}
                    </div>
                </div>

                <div className="glass-panel" style={{ padding: '1.5rem', background: 'linear-gradient(180deg, rgba(56, 189, 248, 0.05) 0%, transparent 100%)' }}>
                    <h4 style={{ marginBottom: '0.75rem', fontSize: '0.9rem', fontWeight: 800 }}>{t.insightTitle}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                        FinAura uses high-order LLM reasoning to detect patterns across your {businessData ? businessData.length : 0} records. Ask about specific anomalies or growth trends.
                    </p>
                </div>
            </div>

            <style>{`
        @media (max-width: 1024px) {
          .ai-advisor-layout { grid-template-columns: 1fr; height: auto; min-height: calc(100vh - 200px); }
          .knowledge-sidebar { display: none; }
        }
      `}</style>
        </div>
    );
};

export default AIAssistant;
