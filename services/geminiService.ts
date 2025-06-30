import { GoogleGenAI } from "@google/genai";

// ✅ Use Vite-compatible env variable
const apiKey = import.meta.env.VITE_API_KEY;

if (!apiKey) {
    throw new Error("VITE_API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey });

/**
 * Describes an image using the Gemini model.
 * @param base64Data The base64 encoded image data, without the data URI prefix.
 * @param mimeType The MIME type of the image.
 * @returns A text description of the image.
 */
export const describeImage = async (base64Data: string, mimeType: string): Promise<string> => {
    try {
        const imagePart = {
            inlineData: {
                data: base64Data,
                mimeType,
            },
        };

        const textPart = {
            text: "Describe this image in detail for a pixel art generator. Focus on objects, colors, mood, and composition. Be concise but descriptive."
        };

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: { parts: [imagePart, textPart] },
        });

        return response.text;
    } catch (error) {
        console.error("Error describing image:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to describe image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image description.");
    }
};


/**
 * Generates pixel art from a text prompt using the Imagen model.
 * @param userPrompt The text prompt from the user.
 * @param style The selected art style to prepend to the prompt.
 * @param negativePrompt Optional text describing what to avoid in the image.
 * @param seed Optional number to ensure deterministic image generation.
 * @returns A base64 encoded data URL of the generated image.
 */
export const generatePixelArt = async (
    userPrompt: string,
    style: string,
    negativePrompt?: string,
    seed?: number,
): Promise<string> => {
    // Enhance the prompt for better pixel art results
    const fullPrompt = `${style}. ${userPrompt}.`;

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: fullPrompt,
            ...(negativePrompt && { negativePrompt: negativePrompt.trim() }),
            ...(seed && { seed }), // Add seed for reproducible results
            config: {
                numberOfImages: 1,
                outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            return `data:image/png;base64,${base64ImageBytes}`;
        } else {
            throw new Error("No image was generated. The response may be empty or contain safety blocks.");
        }
    } catch (error) {
        console.error("Error generating image:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to generate image: ${error.message}`);
        }
        throw new Error("An unknown error occurred during image generation.");
    }
};

/**
 * Gets creative prompt suggestions from Gemini based on a simple idea.
 * @param idea A simple concept from the user.
 * @returns An array of 3 prompt suggestions.
 */
export const getPromptSuggestions = async (idea: string): Promise<string[]> => {
    try {
        const systemInstruction = `You are an expert prompt writer for an AI pixel art generator. Given a simple concept, generate 3 detailed, creative, and visually rich prompts. The prompts should evoke a retro pixel art style.
Return a JSON array of 3 strings. Do not use markdown. The array should be the only thing in your response.

Example input: "cat"
Example output: [
  "A fluffy ginger cat sleeping on a stack of old books in a sun-drenched library.",
  "A cyber-cat with glowing neon eyes prowling through a rainy, futuristic city alley.",
  "A magical cat familiar wearing a tiny wizard hat, summoning a swirl of sparkling particles."
]`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: `Generate 3 prompts for the concept: "${idea}"`,
            config: {
                systemInstruction,
                responseMimeType: 'application/json',
            },
        });

        let jsonStr = response.text.trim();
        const fenceRegex = /^```(\w*)?\s*\n?(.*?)\n?\s*```$/s;
        const match = jsonStr.match(fenceRegex);
        if (match && match[2]) {
            jsonStr = match[2].trim();
        }

        const suggestions = JSON.parse(jsonStr);

        if (Array.isArray(suggestions) && suggestions.every(item => typeof item === 'string')) {
            return suggestions.slice(0, 3); // Ensure we only return 3
        } else {
            throw new Error("Received unexpected data format from AI.");
        }

    } catch (error) {
        console.error("Error getting prompt suggestions:", error);
        if (error instanceof Error) {
            throw new Error(`Failed to get suggestions: ${error.message}`);
        }
        throw new Error("An unknown error occurred while getting suggestions.");
    }
};
