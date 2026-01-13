import { GoogleGenAI } from "@google/genai";

const getAI = () => {
    // Try standard Vite env var first, then the defined process.env
    const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!key || key === "undefined") {
        console.warn("Gemini API Key matches 'undefined' or is missing.");
        return null;
    }
    return new GoogleGenAI({ apiKey: key });
};

const mockAI = {
    models: {
        generateContent: async () => ({ text: "I'm sorry, I can't think right now. (AI API Key is missing in .env)" })
    },
    chats: {
        create: () => ({
            sendMessage: async () => ({ text: "I'm offline. Please configure GEMINI_API_KEY in the .env file to enable me." })
        })
    }
};

export const aiService = {
    analyzeStartup: async (startup) => {
        try {
            const ai = getAI();
            if (!ai) return mockAI.models.generateContent().then(r => r.text);

            const prompt = `Analyze this startup for a Venture Capital investment:
    Name: ${startup.name}
    Sector: ${startup.sector}
    Stage: ${startup.stage}
    Description: ${startup.description}
    Funding Ask: ${startup.fundingAsk}
    
    Please provide:
    1. A brief SWOT analysis.
    2. Potential market risks.
    3. Investment recommendation (Pass, Watch, or High Interest).
    Keep it professional and concise.`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
            });

            return response.text || "Unable to generate analysis at this time.";
        } catch (e) {
            console.warn("AI Error:", e);
            return "AI Analysis temporarily unavailable.";
        }
    },

    getMarketInsight: async (portfolio) => {
        try {
            const ai = getAI();
            if (!ai) return mockAI.models.generateContent().then(r => r.text);

            const sectors = portfolio.map(s => s.sector).join(", ");
            const prompt = `Based on a portfolio concentrated in these sectors: ${sectors}, what are the top 3 emerging trends or risks an investor should watch out for in the next 6 months? Use a professional, data-driven tone.`;

            const response = await ai.models.generateContent({
                model: 'gemini-1.5-flash',
                contents: prompt,
            });

            return response.text || "Insight unavailable.";
        } catch (e) {
            console.warn("AI Error:", e);
            return "Market insights unavailable.";
        }
    },

    chat: async (history, message) => {
        try {
            const ai = getAI();
            if (!ai) return mockAI.chats.create().sendMessage().then(r => r.text);

            // Using gemini-1.5-flash as default
            const modelName = 'gemini-1.5-flash';

            // Fix: Map history to the exact structure expected by SDK (role + parts array)
            const formattedHistory = history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
            }));

            const chat = ai.getGenerativeModel({
                model: modelName,
                systemInstruction: "You are VentureBot, an AI Investment Analyst for VentureFlow. You help VCs analyze deals, understand market trends, and manage their portfolio. Be insightful, slightly conservative in risk assessment, and professional."
            }).startChat({
                history: formattedHistory
            });

            // Fix: Pass message as a simple string or proper object. 
            // The SDK startChat().sendMessage() usually takes a string or Array<string | Part>.
            // We'll pass the string directly as it's the most standard way, effectively 'user' role content.
            const result = await chat.sendMessage(message);
            const response = await result.response;
            return response.text();
        } catch (e) {
            console.error("AI Error:", e);
            // Return the actual error message to help debug
            return `I'm having trouble connecting. Error: ${e.message || e.toString()}`;
        }
    }
};
