import { GoogleGenAI } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const aiService = {
    analyzeStartup: async (startup) => {
        const ai = getAI();
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
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "Unable to generate analysis at this time.";
    },

    getMarketInsight: async (portfolio) => {
        const ai = getAI();
        const sectors = portfolio.map(s => s.sector).join(", ");
        const prompt = `Based on a portfolio concentrated in these sectors: ${sectors}, what are the top 3 emerging trends or risks an investor should watch out for in the next 6 months? Use a professional, data-driven tone.`;

        const response = await ai.models.generateContent({
            model: 'gemini-3-flash-preview',
            contents: prompt,
        });

        return response.text || "Insight unavailable.";
    },

    chat: async (history, message) => {
        const ai = getAI();
        const chat = ai.chats.create({
            model: 'gemini-3-flash-preview',
            config: {
                systemInstruction: "You are VentureBot, an AI Investment Analyst for VentureFlow. You help VCs analyze deals, understand market trends, and manage their portfolio. Be insightful, slightly conservative in risk assessment, and professional.",
            }
        });

        const response = await chat.sendMessage({ message });
        return response.text;
    }
};
