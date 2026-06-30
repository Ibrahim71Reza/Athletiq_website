// app/api/chat/route.ts
import { HarmCategory, HarmBlockThreshold, Content } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import {
    createGeminiClient,
    formatGeminiError,
    GEMINI_MODEL,
    hasGeminiApiKey,
    missingGeminiApiKeyBody,
} from "@/lib/gemini";

const SYSTEM_INSTRUCTION = `You are "FitBot", a friendly, highly knowledgeable, and motivating AI assistant.
Your expertise is STRICTLY LIMITED to:
- Fitness routines and exercises (strength training, cardio, flexibility, etc.)
- Proper exercise form and technique
- Gym equipment and its usage
- Nutrition advice directly related to fitness goals (e.g., macronutrients for muscle gain, pre/post-workout meals)
- Sports supplements (creatine, protein powder, BCAAs, etc.), their uses, benefits, and potential side effects.
- General health topics ONLY as they directly relate to exercise and physical fitness (e.g., importance of sleep for recovery, hydration for workouts).
- Motivation and tips for staying consistent with a fitness plan.

YOU MUST ADHERE TO THE FOLLOWING RULES:
1.  DO NOT answer questions or engage in conversations about any topics outside of the list above.
2.  If a user asks an off-topic question, you MUST politely and concisely state that your knowledge is limited to fitness and health-related topics and you cannot answer that specific query.
3.  Be encouraging and positive in your tone.
4.  Keep your answers informative but try to be reasonably concise.
5.  **GUIDING TO RESOURCES:**
    a.  When you explain an exercise, a complex nutritional concept, or a supplement, you SHOULD proactively offer a suggestion for how the user can find more information or visual demonstrations.
    b.  Frame these suggestions as specific search queries the user can easily use.
    c.  Always recommend searching on reputable platforms like YouTube (for videos) or looking for articles from well-known health/fitness organizations and evidence-based sites.
    d.  Examples of phrasing:
        *   "To see how to perform a [Exercise Name] correctly, you can search on YouTube for: 'proper [Exercise Name] form certified trainer'."
        *   "For more details on [Topic], a good search query for reputable articles would be: '[Topic] benefits and risks Examine.com' or '[Topic] scientific review PubMed'."
        *   "If you'd like a video walkthrough of [Concept], try searching YouTube for: '[Concept] explained visually'."
    e.  **DO NOT attempt to generate or provide actual URLs yourself.** Your role is to craft helpful search queries.
    f.  When suggesting a search, you can optionally add a brief reminder like, "Look for content from certified professionals or trusted organizations."
6.  Do not generate harmful, unethical, biased, or inappropriate content.
7.  If the user's query is vague, you can ask for clarification.
`;

const BOT_INITIAL_GREETING = "Hello! I'm FitBot. I can answer your fitness questions and suggest helpful search queries for videos or articles. How can I help?";

export async function POST(req: NextRequest) {
console.log("API Route: POST request received.");

if (!hasGeminiApiKey()) {
    console.error("API Route: API key not configured!");
    return NextResponse.json(missingGeminiApiKeyBody(), { status: 500 });
}

try {
    const { history: clientHistory, message: currentUserMessage } = await req.json();
    // console.log("API Route: Received clientHistory:", JSON.stringify(clientHistory, null, 2));
    // console.log("API Route: Received currentUserMessage:", currentUserMessage);

    if (currentUserMessage === "" && (!clientHistory || clientHistory.length === 0)) {
    console.log("API Route: Sending initial greeting.");
    return NextResponse.json({ response: BOT_INITIAL_GREETING });
    }

    const genAI = createGeminiClient();
    const model = genAI.getGenerativeModel({
        model: GEMINI_MODEL,
        systemInstruction: SYSTEM_INSTRUCTION, // This is where the main behavioral control happens
    });

    const generationConfig = {
    temperature: 0.7, // Slightly lower for more factual fitness advice
    topK: 1, // Consider adjusting if responses are too narrow
    topP: 0.95,
    maxOutputTokens: 2048,
    };

    const safetySettings = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    const conversationTurns: Content[] = [];
    if (clientHistory && clientHistory.length > 0) {
    clientHistory.forEach((item: { role: string; text: string }) => {
        if (item.text && item.text.trim() !== "") {
        conversationTurns.push({
            role: item.role as ('user' | 'model'),
            parts: [{ text: item.text }],
        });
        }
    });
    }
    if (currentUserMessage && currentUserMessage.trim() !== "") {
    conversationTurns.push({
        role: 'user',
        parts: [{ text: currentUserMessage }],
    });
    } else if (conversationTurns.length === 0) {
    // If history is empty AND current message is empty (after initial greeting check)
    console.warn("API Route: Empty history and empty current message, but not initial greeting scenario. This shouldn't happen.");
    return NextResponse.json({ response: "I'm ready for your fitness questions!" });
    }
    
    // console.log("API Route: Contents for generateContent:", JSON.stringify(conversationTurns, null, 2));

    if (conversationTurns.length === 0) {
        console.warn("API Route: No valid content to send to model after processing. Sending default helpful message.");
        return NextResponse.json({ response: "Please ask a fitness-related question!" });
    }
    
    // console.log("API Route: Calling model.generateContent...");
    const result = await model.generateContent({
        contents: conversationTurns,
        generationConfig,
        safetySettings,
    });
    // console.log("API Route: model.generateContent call completed.");

    const response = result.response;
    const botResponseText = response.text();
    // console.log("API Route: Bot response text:", botResponseText);

    return NextResponse.json({ response: botResponseText });

} catch (error: any) {
    console.error("--------------------------------------------------");
    console.error("API Route: CAUGHT ERROR IN POST HANDLER");
    console.error("Error Name:", error.name);
    console.error("Error Message:", error.message);
    if (error.stack) console.error("Error Stack:", error.stack.substring(0, 500)); // Log first 500 chars of stack
    if (error.cause) console.error("Error Cause:", JSON.stringify(error.cause, Object.getOwnPropertyNames(error.cause)));
    // console.error("Full Error Object (stringified):", JSON.stringify(error, Object.getOwnPropertyNames(error)));
    console.error("--------------------------------------------------");
    
    const formattedError = formatGeminiError(error, "AI service request failed.");
    return NextResponse.json(formattedError.body, { status: formattedError.status });
}
}
