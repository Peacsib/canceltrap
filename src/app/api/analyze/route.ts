import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";
import { SubscriptionDefusalResponse } from "@/lib/types";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageBase64, mimeType } = body;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "GEMINI_API_KEY is not configured in .env.local. Please add your Gemini API key or use one of the built-in sample presets.",
        },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });
    const model = process.env.GEMINI_MODEL || "gemini-3.8-flash";

    const systemPrompt = `You are CancelTrap, an expert consumer-advocacy AI specialized in defusing subscription dark patterns and auto-renewal traps.
Analyze the provided subscription confirmation, billing receipt, or trial screenshot.

You MUST respond strictly with valid JSON conforming to the following structure:
{
  "isSubscription": boolean,
  "unrecognizedReason": string,
  "merchant": {
    "name": string,
    "category": string,
    "directPortalUrl": string,
    "finePrintNotes": string
  },
  "billing": {
    "amount": number,
    "currency": string,
    "billingCycle": "monthly" | "annual" | "weekly" | "trial",
    "renewalDate": string,
    "daysUntilRenewal": number,
    "vampireBleed5Year": number
  },
  "darkPattern": {
    "detected": boolean,
    "patternType": string,
    "severity": "critical" | "warning" | "info",
    "summary": string,
    "tricksExposed": string[]
  },
  "defusalChecklist": [
    {
      "stepNumber": number,
      "instruction": string,
      "decoyWarning": string
    }
  ],
  "killSwitch": {
    "eventTitle": string,
    "suggestedAlertDate": string,
    "alertMinutesBefore": number,
    "eventDescription": string
  }
}

CRITICAL RULES:
1. If the image is NOT a subscription confirmation, billing receipt, SaaS checkout, or trial email, set "isSubscription": false and populate "unrecognizedReason" with a friendly explanation.
2. For "vampireBleed5Year", calculate 5 years of compounding cost (e.g. amount * 60 for monthly, amount * 5 for annual).
3. If the date is relative (e.g. "ends in 3 days"), infer the ISO date based on current timestamp.
4. Output raw JSON only. Do NOT wrap in markdown or backticks.`;

    const response = await ai.models.generateContent({
      model,
      contents: [
        {
          role: "user",
          parts: [
            { text: systemPrompt },
            {
              inlineData: {
                data: imageBase64,
                mimeType: mimeType || "image/png",
              },
            },
          ],
        },
      ],
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const parsedData: SubscriptionDefusalResponse = JSON.parse(cleanedText);

    return NextResponse.json(parsedData);
  } catch (err: any) {
    console.error("Gemini analysis error:", err);
    return NextResponse.json(
      {
        error:
          err.message ||
          "Failed to analyze subscription receipt with Gemini 3.8 Flash.",
      },
      { status: 500 }
    );
  }
}
