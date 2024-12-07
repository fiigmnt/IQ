import OpenAI from "openai";

// Initialize the OpenAI client
// const configuration = new Configuration({
//   apiKey: process.env.OPENAI_API_KEY, // Your OpenAI API key
// });
const openai = new OpenAI({
  apiKey:
    "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",
});

/**
 * Generates reasoning for an IQ score based on the username and score.
 * @param {string} username - The username of the user.
 * @param {string} iqScore - The IQ score of the user.
 * @returns {Promise<string>} - The generated reasoning for the IQ score.
 */
export default async function generateReasoningFromScore(username: string, iqScore: string) {
  try {
    const prompt = `
      Here is the username of a twitter user: ${username}. I want you to pretend that you have read all of their tweets
      and are assigning them an iq score based on their tweets. You should be witty and sarcastic in your response.

      I will provide the iq score, which is ${iqScore} and you'll provide the reasoning for the score.

      Please return just the reasoning in three sentences or less. Feel free to be rude if its mid or low.
    `;

    const completions = await openai.chat.completions.create({
      model: "gpt-4", // Use the desired model
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 100, // Limit the response length
      temperature: 0.7, // Adjust creativity
    });

    // Extract reasoning from the response
    const reasoning = completions.choices[0].message.content;
    return { score: iqScore, reasoning: reasoning || "No reasoning could be generated." };
  } catch (error) {
    console.error("Error generating reasoning:", error);
    throw new Error("Failed to generate reasoning for the IQ score.");
  }
}
