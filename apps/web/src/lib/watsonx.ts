/**
 * IBM watsonx.ai — Incident Intake Agent
 *
 * Extracts structured fields from a free-text incident description.
 * Output is ASSISTIVE ONLY — it must not automatically trigger dispatches
 * or clinical decisions. A human dispatcher always makes the final call.
 *
 * Returns null and logs gracefully if the IBM credentials are not set,
 * so the app still works without an API key during local development.
 */

export interface IncidentExtraction {
  incident_type: string;
  location_hint: string;
  reported_casualties: number;
  severity_indicator: "low" | "medium" | "high" | "unknown";
  unconscious_reported: boolean;
  language_detected: string;
}

export async function extractIncidentFields(
  description: string
): Promise<IncidentExtraction | null> {
  const apiKey    = process.env.IBM_WATSONX_API_KEY;
  const projectId = process.env.IBM_WATSONX_PROJECT_ID;
  const url       = process.env.IBM_WATSONX_URL ?? "https://us-south.ml.cloud.ibm.com";

  if (!apiKey || !projectId) {
    console.warn("[watsonx] IBM_WATSONX_API_KEY or IBM_WATSONX_PROJECT_ID not set — skipping AI extraction.");
    return null;
  }

  // 1. Get IAM access token
  const tokenRes = await fetch("https://iam.cloud.ibm.com/identity/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "urn:ibm:params:oauth:grant-type:apikey",
      apikey: apiKey,
    }),
  });

  if (!tokenRes.ok) {
    console.error("[watsonx] Failed to obtain IAM token:", await tokenRes.text());
    return null;
  }

  const { access_token } = await tokenRes.json() as { access_token: string };

  // 2. Call watsonx.ai text generation
  const prompt = `You are a structured incident extraction assistant for an emergency coordination system.

Extract the following fields from the incident description below and respond ONLY with a valid JSON object — no extra text.

Fields:
- incident_type: string (e.g. "road_accident", "fire", "medical_emergency", "other")
- location_hint: string (the location mentioned, or "unknown")
- reported_casualties: integer (number of people mentioned as injured or affected; 0 if none mentioned)
- severity_indicator: "low" | "medium" | "high" | "unknown" (based only on explicit cues; never infer)
- unconscious_reported: boolean
- language_detected: string (ISO 639-1 code, e.g. "en", "hi", "kn")

Incident description:
"""${description}"""

JSON:`;

  const genRes = await fetch(`${url}/ml/v1/text/generation?version=2023-05-29`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
    body: JSON.stringify({
      model_id: "ibm/granite-13b-chat-v2",
      project_id: projectId,
      input: prompt,
      parameters: {
        decoding_method: "greedy",
        max_new_tokens: 300,
        stop_sequences: ["\n\n"],
      },
    }),
  });

  if (!genRes.ok) {
    console.error("[watsonx] Text generation failed:", await genRes.text());
    return null;
  }

  const genData = await genRes.json() as { results: { generated_text: string }[] };
  const raw = genData.results?.[0]?.generated_text?.trim();

  if (!raw) return null;

  try {
    // Extract JSON block if model wrapped it in markdown fences
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    return jsonMatch ? (JSON.parse(jsonMatch[0]) as IncidentExtraction) : null;
  } catch {
    console.error("[watsonx] Failed to parse JSON response:", raw);
    return null;
  }
}
