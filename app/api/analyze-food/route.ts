// app/api/analyze-food/route.ts
import { 
    HarmCategory, 
    HarmBlockThreshold, 
    Part, 
    Content,
    SafetySetting // <--- IMPORT THIS
} from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import {
    createGeminiClient,
    formatGeminiError,
    GEMINI_MODEL,
    hasGeminiApiKey,
    missingGeminiApiKeyBody,
} from "@/lib/gemini";

export async function POST(req: NextRequest) {
if (!hasGeminiApiKey()) {
    return NextResponse.json(missingGeminiApiKeyBody(), { status: 500 });
}

try {
    const { 
        image_data,
        mime_type,
        prompt,
        history 
    } = await req.json();

    if (!prompt) {
    return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const genAI = createGeminiClient();
    const model = genAI.getGenerativeModel({ model: GEMINI_MODEL });

    const generationConfig = {
    temperature: 0.7,
    maxOutputTokens: 2048,
    };

    // EXPLICITLY TYPE safetySettings
    const safetySettings: SafetySetting[] = [ 
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const contentParts: (string | Part)[] = [];

    const geminiHistory: Content[] = (history || []).map((msg: {role: string, text: string}) => ({
        role: msg.role === "system" ? "user" : (msg.role as "user" | "model"), // Ensure role is 'user' or 'model'
        parts: [{ text: msg.text }]
    }));

    if (image_data && mime_type) {
    const imagePart: Part = {
        inlineData: { data: image_data, mimeType: mime_type },
    };
    contentParts.push(prompt); 
    contentParts.push(imagePart); 
    } else {
    contentParts.push(prompt);
    }
    
    const requestContents: Content[] = [
        ...geminiHistory,
        { role: "user", parts: contentParts.map(p => typeof p === 'string' ? {text: p} : p) }
    ];

    // Log the request contents for debugging if needed
    // console.log("Requesting Gemini with contents:", JSON.stringify(requestContents, null, 2));

    const result = await model.generateContent({
        contents: requestContents,
        generationConfig,
        safetySettings // Now correctly typed
    });

    const response = result.response;
    
    if (!response) {
        // Handle cases where the response might be undefined (e.g., if blocked by safety settings without throwing an error directly)
        console.error("Gemini API returned an undefined response. This might be due to safety settings or other content filters.");
        return NextResponse.json({ error: "AI response was blocked or empty. Please try a different prompt or image." }, { status: 500 });
    }

    const analysisText = response.text();

    return NextResponse.json({ analysis: analysisText });

} catch (error: any) {
    console.error("Error in /api/analyze-food:", error);
    const formattedError = formatGeminiError(error, "AI analysis request failed.");
    return NextResponse.json(formattedError.body, { status: formattedError.status });
}
}
