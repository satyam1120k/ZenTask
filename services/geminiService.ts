import { GoogleGenAI } from "@google/genai";
import { Task } from "../types";

const apiKey = process.env.API_KEY || '';

// Initialize safely, even if key is missing (handled in UI)
let ai: GoogleGenAI | null = null;
if (apiKey) {
  ai = new GoogleGenAI({ apiKey });
}

export const getTaskInsights = async (tasks: Task[]): Promise<string> => {
  if (!ai) return "API Key not configured.";
  if (tasks.length === 0) return "Add some tasks to get started!";

  const taskSummary = tasks.map(t => 
    `- ${t.title} (${t.completed ? 'Completed' : 'Pending'})`
  ).join('\n');

  const prompt = `
    You are a motivational productivity coach. Analyze the following user's task list and provide a 
    short, punchy, and encouraging insight or tip (max 2 sentences). 
    Focus on their progress and what they should tackle next.
    
    Tasks:
    ${taskSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });
    return response.text || "Keep pushing forward!";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Great job tracking your tasks! Keep it up.";
  }
};
