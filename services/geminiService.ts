
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const API_KEY = process.env.API_KEY;

const convertFileToBase64 = (file: File): Promise<{ mimeType: string; base64Data: string }> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string; // e.g., data:audio/mpeg;base64,xxxxx
      const parts = result.split(';base64,');
      if (parts.length !== 2) {
        reject(new Error("Invalid file format for base64 conversion. Expected 'data:[mime/type];base64,[data]'"));
        return;
      }
      const mimeTypePart = parts[0].split(':')[1];
      if (!mimeTypePart) {
        reject(new Error("Could not determine MIME type from file data."));
        return;
      }
      resolve({ mimeType: mimeTypePart, base64Data: parts[1] });
    };
    reader.onerror = (error) => {
      reject(new Error(`FileReader error: ${error.target?.error?.message || 'Unknown error'}`));
    };
    reader.readAsDataURL(file);
  });
};

export const transcribeAudio = async (audioFile: File): Promise<string> => {
  if (!API_KEY) {
    console.error("API_KEY environment variable is not set.");
    throw new Error(
      "Gemini API Key is not configured. Please ensure the API_KEY environment variable is set."
    );
  }

  try {
    const { mimeType, base64Data } = await convertFileToBase64(audioFile);

    const ai = new GoogleGenAI({ apiKey: API_KEY });
    
    const audioPart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Data,
      },
    };

    const textPromptPart = {
      text: "Transcribe the following audio to text accurately. Provide only the transcribed text.",
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17', // This model supports multimodal inputs
      contents: { parts: [audioPart, textPromptPart] },
    });
    
    const transcription = response.text;
    if (typeof transcription !== 'string') {
        console.error("Unexpected response format from Gemini API:", response);
        throw new Error("Failed to get valid text transcription from the API.");
    }
    
    return transcription;

  } catch (error: any) {
    console.error("Error during transcription process:", error);
    if (error.message && error.message.includes("API Key not valid")) {
        throw new Error("Invalid Gemini API Key. Please check your API_KEY environment variable.");
    }
    if (error.message && error.message.toLowerCase().includes("quota")) {
        throw new Error("API quota exceeded. Please check your Gemini API plan and usage.");
    }
    // Re-throw a more generic error or the original one if it's already informative
    throw new Error(error.message || "An unexpected error occurred while contacting the AI service.");
  }
};
