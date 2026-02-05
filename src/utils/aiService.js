import axios from 'axios';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const analyzeDynamicFinancials = async (data, apiKey, mode = 'full_audit') => {
    if (!apiKey) throw new Error("API Key Required for AI Intelligence");

    const prompts = {
        full_audit: "Execute an elite-level SME Financial Forensic Audit. Analyze the complex interplay between revenue velocity, expense burn patterns, and liquidity ratios. Identify non-obvious operational inefficiencies. Provide a precise health score (0-100), key multi-dimensional findings, critical risk vectors, and high-impact strategic maneuvers.",
        risk_modeling: "Construct a stress-test scenario model. Map current financial metrics against high market volatility and supply chain disruption. Quantify liquidity decay and identify catastrophic failure points. Output detailed mitigation blueprints.",
        growth_engine: "Synchronize business metrics with industry growth benchmarks. Detect revenue expansion opportunities and capital allocation optimizations. Recommend specific financial instruments (MSME Loans, G-Sec, etc.) for treasury management.",
        tax_brain: "Scan for multi-layered tax leakage and structural compliance anomalies. Evaluate GST input-output parity and regulatory risk. Forecast tax-adjusted cash flow."
    };

    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are FinAura Ultra-Core, a world-class financial intelligence and strategy engine. 
            Analyze the provided raw dataset with forensic precision. Look for deep correlations, seasonal anomalies, and margin drift.
            Avoid generic advice. If data is sparse, provide a highly probable probabilistic range.
            Your output MUST be a strict JSON object. No narrative outside the JSON.`
                    },
                    {
                        role: "user",
                        content: `TASK: ${prompts[mode]}. 
            INPUT DATASET: ${JSON.stringify(data.slice(0, 150))}. 
            REQUIRED STRUCTURE: { "score": number, "findings": string[], "alerts": string[], "recommendations": [{"title": string, "description": string, "impact": "LOW"|"MEDIUM"|"HIGH"|"CRITICAL", "action": string}] }`
                    }
                ],
                response_format: { type: "json_object" },
                temperature: 0.15 // High precision
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return JSON.parse(response.data.choices[0].message.content);
    } catch (error) {
        console.error("FinAura Forensic Error:", error);
        throw error;
    }
};

export const chatWithIntelligence = async (messages, businessData, apiKey) => {
    try {
        const response = await axios.post(
            GROQ_API_URL,
            {
                model: "llama-3.3-70b-versatile",
                messages: [
                    {
                        role: "system",
                        content: `You are the FinAura Neural Advisor. Access Path: ${JSON.stringify(businessData ? businessData.slice(0, 30) : 'None')}. 
            CRITICAL: Provide ONLY short, perfect, and professional answers. No preamble. No fluff. 
            Keep responses under 3-100 words. Focus on data-backed precision.`
                    },
                    ...messages
                ],
                temperature: 0.4
            },
            {
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data.choices[0].message.content;
    } catch (error) {
        return "Neural Uplink Disrupted. Check System Config.";
    }
};
