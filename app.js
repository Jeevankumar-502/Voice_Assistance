async getGeminiResponse(prompt) {
    const model = "gemini-3.5-flash";

    const url =
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const systemInstruction =
        "You are Nexus, a premium, concise AI voice assistant. " +
        "Keep your responses short, helpful, and natural for speech. " +
        "Avoid long lists or complex markdown.";

    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    {
                        text: `${systemInstruction}\n\nUser: ${prompt}`
                    }
                ]
            }
        ]
    };

    try {
        const response = await fetch(url, {
            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "x-goog-api-key": this.apiKey
            },

            body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error("Gemini API Error:", data);

            throw new Error(
                data?.error?.message ||
                `Gemini API Error: ${response.status}`
            );
        }

        const text =
            data?.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!text) {
            console.error("Unexpected Gemini response:", data);
            throw new Error("Gemini returned an empty response.");
        }

        return text;

    } catch (error) {
        console.error("Gemini request failed:", error);
        throw error;
    }
}
