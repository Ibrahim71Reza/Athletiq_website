// app/api/nutrition-tool/route.ts
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold, Content, SafetySetting, GenerationConfig, FinishReason, SafetyRating } from "@google/generative-ai"; // Added FinishReason, SafetyRating
import { NextRequest, NextResponse } from "next/server";

const MODEL_NAME = "gemini-1.5-flash-latest"; 
const API_KEY = process.env.GEMINI_API_KEY || "";

const MEAL_PLANNER_SYSTEM_INSTRUCTION = `You are "NutriPlanner AI" for the Athlytiq fitness app.
Your task is to generate a structured, helpful, and general meal plan based on the user's inputs, specifically for the number of days specified in 'Plan Duration'.

YOU MUST ADHERE TO THE FOLLOWING RULES:
1.  **Output Format:** Respond ONLY with a single, valid JSON object. Do not include any conversational text, markdown formatting (like \`\`\`json), or any characters before or after the JSON object. The JSON object must strictly follow this structure:
    {
    "title": "Suggested [User's Goal] Meal Plan ([User's Plan Duration]-Day)", 
    "overallSummary": "A brief (2-3 sentences) overview of the entire plan's focus and approach for the specified duration. Mention the duration.",
    "planDurationDays": N, // This MUST match the 'Plan Duration' from the user's request.
    "dailyPlan": [ 
        // This array MUST contain N objects, where N is the 'planDurationDays'.
        { 
        "day": "Day 1", // Label sequentially, e.g., Day 1, Day 2, ... Day N
        "dailySummary": "Optional: A very brief (1 sentence) theme or focus for this specific day's meals.",
        "meals": [ // Array of meals based on user's 'Number of Meals per Day' input
            { "name": "Breakfast", "items": ["Oatmeal (e.g., 1/2 cup dry) with mixed berries (e.g., 1 cup) and almonds (e.g., 10-15)", "Glass of water or unsweetened tea"], "notes": "Focus on complex carbs and protein for sustained energy. Adjust portions to your needs." },
            { "name": "Lunch", "items": ["Grilled chicken breast (e.g., 100-150g) salad with mixed greens, cucumber, cherry tomatoes", "2 tbsp olive oil & lemon vinaigrette"], "notes": "Prioritize lean protein and plenty of fresh vegetables." },
            { "name": "Dinner", "items": ["Baked salmon (e.g., 120-150g) with roasted asparagus (e.g., 1 cup) and quinoa (e.g., 1/2 cup cooked)"], "notes": "A balanced meal with healthy fats and fiber." }
            // Dynamically add more meals (e.g., "Mid-Morning Snack", "Afternoon Snack") to match 'Number of Meals per Day'.
        ]
        }
        // ... additional day objects up to N ...
    ],
    "consolidatedShoppingList": ["Oats", "Mixed Berries", "Almonds", /* ... all unique ingredients from all days ... */],
    "generalTips": [
        "Drink plenty of water throughout the plan.",
        "Remember these are general portion suggestions; adjust to your individual caloric and macronutrient needs, which I cannot calculate precisely.",
        "Focus on whole, unprocessed foods as much as possible.",
        "Listen to your body's hunger and fullness signals.",
        "For specific dietary advice tailored to medical conditions or precise athletic performance, consult a registered dietitian or sports nutritionist."
    ]
    }
    If 'Coaching Mode Active' is true, make 'notes' for meals, 'dailySummary', and 'generalTips' more detailed, educational, and motivational, providing rationale.
    If false, keep them concise and factual.
    The "items" in meals should include example portion sizes (e.g., "100g", "1 cup", "1 medium apple") to be more practical, but always preface that these are general estimates.
    The length of the "dailyPlan" array MUST exactly match the "Plan Duration" specified by the user.
2.  **Content Focus:**
    *   Accurately reflect the user's 'Goal', 'Dietary Preferences', 'Number of Meals per Day', and 'Plan Duration'.
    *   Strictly avoid any foods listed in 'Foods to Avoid'.
    *   Suggest common, generally healthy, and reasonably accessible foods.
3.  **NO MEDICAL ADVICE:** Do not make medical claims or provide plans for specific health conditions.
4.  **Estimates Only:** All nutritional values are implied and general. You are not performing precise calculations.
`;

const RECIPE_GENERATOR_SYSTEM_INSTRUCTION = `You are "ChefBot AI" for the Athlytiq fitness app.
Your primary role is to generate HEALTHY and NUTRITIOUS recipe ideas that align with fitness goals, based on user inputs.

YOU MUST ADHERE TO THE FOLLOWING RULES:
1.  **Output Format:** Respond ONLY with a single, valid JSON object. Do not include any conversational text, markdown formatting, or any characters before or after the JSON object. The JSON object must strictly follow this structure:
    {
    "title": "AI-Generated: [Descriptive and Appealing Recipe Name]",
    "description": "A short, enticing description (1-2 sentences) highlighting its health benefits or suitability for fitness.",
    "prepTime": "e.g., 15 minutes",
    "cookTime": "e.g., 25 minutes",
    "servings": "e.g., 2-3 servings",
    "ingredients": [
        // List ingredients with estimated healthy portion sizes where appropriate
        "1 cup quinoa, rinsed",
        "2 boneless, skinless chicken breasts (approx. 120-150g each), cubed",
        "1 tbsp extra virgin olive oil",
        "1 red bell pepper, sliced",
        "1 head of broccoli, cut into florets",
        // Prioritize whole foods, lean proteins, vegetables, healthy fats.
    ],
    "instructions": [
        // Clear, step-by-step instructions. Suggest healthier cooking methods (baking, grilling, steaming, stir-frying with minimal oil).
        "Cook quinoa according to package directions using water or vegetable broth.",
        "While quinoa cooks, lightly toss chicken with preferred herbs and spices (e.g., paprika, garlic powder, oregano).",
        "Heat olive oil in a large non-stick skillet or wok over medium-high heat.",
        "Add chicken and cook until browned and cooked through. Remove and set aside.",
        "Add bell pepper and broccoli to the skillet, stir-fry for 5-7 minutes until tender-crisp.",
        // ... more steps
    ],
    "nutritionHighlights": [
        // Focus on positive nutritional aspects. Be general, do NOT provide exact macro/calorie counts.
        "Excellent source of lean protein for muscle repair and growth.",
        "Rich in fiber from whole grains and vegetables, aiding digestion.",
        "Contains healthy fats from olive oil.",
        "Packed with vitamins and minerals."
    ],
    "cuisineTypeSuggestion": "[Suggested Cuisine, e.g., Mediterranean-inspired]" // Optional
    }
2.  **HEALTH & NUTRITION FIRST:**
    *   **Prioritize Whole Foods:** Emphasize fresh vegetables, fruits, lean proteins (chicken breast, fish, tofu, legumes), whole grains (quinoa, brown rice, oats), and healthy fats (avocado, nuts, seeds, olive oil).
    *   **Minimize Processed Ingredients:** Avoid suggesting highly processed foods, refined sugars, excessive unhealthy fats (trans fats, excessive saturated fats from unhealthy sources), or overly salty ingredients.
    *   **Healthier Cooking Methods:** Suggest baking, grilling, steaming, poaching, stir-frying with minimal oil over deep-frying or heavy saucing.
    *   **Portion Awareness:** While you provide ingredient lists, your "nutritionHighlights" should reinforce general healthy portion concepts if relevant.
3.  **Content Focus (User Inputs):**
    *   Strictly align with the user's 'Recipe Goal/Type' (e.g., if "Low Carb," ensure the recipe is genuinely low carb).
    *   Prioritize using 'Main Ingredients' provided by the user in a healthy context.
    *   Strictly adhere to 'Dietary Preferences' (e.g., Vegan, Gluten-Free).
    *   Consider 'Cuisine Type' while maintaining health focus.
4.  **NO MEDICAL ADVICE/ALLERGEN GUARANTEES:** Users are responsible for checking ingredients against their allergies and consulting professionals for medical dietary needs. Reiterate this if a query seems to touch on medical aspects.
5.  **Clarity & Measurements:** Instructions must be clear. Use common, reasonable measurements.
6.  **Avoid "Unhealthy" Twists:** Do not suggest ways to make a healthy recipe "more indulgent" with unhealthy additions unless specifically asked and even then, do so cautiously with disclaimers.
`;


export async function POST(req: NextRequest) {
if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
}

let payload: any = {}; // Declare payload outside try to access in catch

try {
    payload = await req.json(); // Assign inside try
    const { mode } = payload;

    if (!mode) {
    return NextResponse.json({ error: "Missing mode (mealPlanner or recipeGenerator)" }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(API_KEY);
    let systemInstruction = "";
    let userPromptForAI = "";

    if (mode === "mealPlanner") {
    systemInstruction = MEAL_PLANNER_SYSTEM_INSTRUCTION;
    userPromptForAI = `
        User Inputs for Meal Plan:
        - Fitness Goal: ${payload.goal || 'Not specified'}
        - Dietary Preferences: ${payload.dietaryPreferences?.join(', ') || 'None'}
        - Number of Meals per Day: ${payload.numMealsPerDay || 3} 
        - Plan Duration: ${payload.planDurationDays || 1} day(s) 
        - Foods to Avoid: ${payload.dislikedFoods || 'None'}
        - Coaching Mode Active: ${payload.coachingMode !== undefined ? payload.coachingMode : true}

        Based on these inputs and your system instructions, generate the meal plan JSON.
        Ensure the "planDurationDays" in your JSON output matches the user's requested duration.
        The "dailyPlan" array in your JSON output must contain exactly ${payload.planDurationDays || 1} day objects.
    `;
    } else if (mode === "recipeGenerator") {
    systemInstruction = RECIPE_GENERATOR_SYSTEM_INSTRUCTION;
    userPromptForAI = `
        User Inputs for Recipe:
        - Recipe Goal/Type: ${payload.goal || 'Any'}
        - Main Ingredients to use (if any): ${payload.mainIngredients?.join(', ') || 'Be creative based on goal'}
        - Dietary Preferences: ${payload.dietaryPreferences?.join(', ') || 'None'}
        - Cuisine Type (optional): ${payload.cuisineType || 'Any'}

        Based on these inputs and your system instructions, generate the recipe JSON.
    `;
    } else {
    return NextResponse.json({ error: "Invalid mode provided" }, { status: 400 });
    }
    
    const model = genAI.getGenerativeModel({ 
        model: MODEL_NAME,
        systemInstruction: { role: "system", parts: [{text: systemInstruction}] },
        generationConfig: { 
            responseMimeType: "application/json",
        }
    });

    const generationConfigForCall: GenerationConfig = {
    temperature: 0.6,
    maxOutputTokens: 8192,
    };

    const safetySettingsForCall: SafetySetting[] = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH },
    ];
    
    console.log(`[API /api/nutrition-tool] Mode: ${mode}, Sending prompt to Gemini...`);

    const result = await model.generateContent({
        contents: [{ role: "user", parts: [{text: userPromptForAI}] }],
        generationConfig: generationConfigForCall,
        safetySettings: safetySettingsForCall
    });

    const response = result.response;
    if (!response || !response.text()) {
        console.error("[API /api/nutrition-tool] Gemini API returned an undefined or empty response.");
        const candidate = response?.candidates?.[0];
        let blockReason = "Unknown reason or filtered by API.";
        if (candidate?.finishReason && candidate.finishReason !== FinishReason.STOP) { // Use FinishReason enum
            blockReason = `Content generation stopped due to: ${candidate.finishReason}.`;
            // Check safetyRatings probability instead of a 'blocked' property
            if (candidate.safetyRatings && candidate.safetyRatings.some(rating => 
                rating.probability === "HIGH" || rating.probability === "MEDIUM" 
                // Adjust MEDIUM/HIGH check based on how strict you want to be or what thresholds you set
            )) {
                blockReason += " Potentially blocked by safety filters due to high/medium harm probability.";
            }
        }
        throw new Error(`AI response was empty or filtered. ${blockReason} Please try rephrasing your request or check content policies.`);
    }
    
    const responseText = response.text();
    let parsedResult;
    try {
        parsedResult = JSON.parse(responseText);
    } catch (parseError: any) {
        console.error("[API /api/nutrition-tool] Failed to parse Gemini JSON response:", parseError.message);
        console.error("[API /api/nutrition-tool] Problematic Gemini response snippet:", responseText.substring(0, 500) + "...");
        throw new Error("AI returned data in an unexpected format. Please try again. If the issue persists, the AI might be struggling with the complexity of the request.");
    }

    return NextResponse.json({ result: parsedResult });

} catch (error: any) {
    // Now payload is accessible here for logging
    console.error(`[API /api/nutrition-tool] Error (mode: ${payload?.mode || 'unknown'}):`, error.message);
    // console.error(error.stack); // Optionally log stack for more details
    let errorMessage = "AI tool request failed.";
    if (error.message) errorMessage = error.message;
    return NextResponse.json({ error: errorMessage, details: error.toString() }, { status: 500 });
}
}