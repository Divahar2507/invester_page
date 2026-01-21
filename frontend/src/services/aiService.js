import { GoogleGenerativeAI } from "@google/generative-ai";

const getAI = () => {
    // Try standard Vite env var first, then the defined process.env
    const key = import.meta.env.VITE_GEMINI_API_KEY || process.env.API_KEY || process.env.GEMINI_API_KEY;
    if (!key || key === "undefined") {
        console.warn("Gemini API Key matches 'undefined' or is missing.");
        return null;
    }
    return new GoogleGenerativeAI(key);
};

const mockAI = {
    models: {
        generateContent: async () => ({ response: { text: () => "I'm sorry, I can't think right now. (AI API Key is missing in .env)" } })
    },
    chats: {
        create: () => ({
            sendMessage: async () => ({ response: { text: () => "I'm offline. Please configure GEMINI_API_KEY in the .env file to enable me." } })
        })
    }
};

export const aiService = {
    analyzeStartup: async (startup) => {
        try {
            const ai = getAI();
            if (!ai) return (await mockAI.models.generateContent()).response.text();

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

            const model = ai.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            return result.response.text() || "Unable to generate analysis at this time.";
        } catch (e) {
            console.warn("AI Error:", e);
            return "AI Analysis temporarily unavailable. " + (e.message || "");
        }
    },

    getMarketInsight: async (portfolio) => {
        try {
            const ai = getAI();
            if (!ai) return (await mockAI.models.generateContent()).response.text();

            const sectors = portfolio.map(s => s.sector).join(", ");
            const prompt = `Based on a portfolio concentrated in these sectors: ${sectors}, what are the top 3 emerging trends or risks an investor should watch out for in the next 6 months? Use a professional, data-driven tone.`;

            const model = ai.getGenerativeModel({ model: "gemini-pro" });
            const result = await model.generateContent(prompt);
            return result.response.text() || "Insight unavailable.";
        } catch (e) {
            console.warn("AI Error:", e);
            return "Market insights unavailable.";
        }
    },

    chat: async (history, message) => {
        try {
            const ai = getAI();
            if (!ai) return (await mockAI.chats.create().sendMessage()).response.text();

            // Use newer flash model
            const modelName = 'gemini-1.5-flash';

            // Map history to the exact structure expected by SDK (role + parts array)
            const formattedHistory = history.map(h => ({
                role: h.role === 'user' ? 'user' : 'model',
                parts: [{ text: h.content }]
            }));

            const model = ai.getGenerativeModel({
                model: modelName
            });

            const chat = model.startChat({
                history: [
                    {
                        role: 'user',
                        parts: [{ text: "You are VentureBot, an AI Investment Analyst. Help VCs analyze deals. Be professional." }]
                    },
                    {
                        role: 'model',
                        parts: [{ text: "Understood. I am VentureBot, ready to assist." }]
                    },
                    ...formattedHistory
                ]
            });

            const result = await chat.sendMessage(message);
            return result.response.text();
        } catch (e) {
            console.error("AI Error:", e);
            if (e.message.includes('404')) {
                return "I'm having trouble connecting (Model Not Found). Please check your API key validity.";
            }
            return `I'm having trouble connecting. Error: ${e.message || e.toString()}`;
        }
    }
};
