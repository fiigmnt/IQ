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
 * Generates an IQ score and reasoning using GPT.
 * @param {string} username - The user's username.
 * @param {number} followerCount - Number of followers the user has.
 * @param {number} followingCount - Number of accounts the user follows.
 * @param {string} bio - The user's bio.
 * @returns {Promise<object>} - Generated IQ score and reasoning.
 */
export default async function generateReasoning(
  username: string,
  followerCount: string,
  followingCount: string,
  bio: string
) {
  // Craft the prompt
  const prompt = `
      Here is the username of a twitter user: ${username}.
      Here is their follower counter: ${followerCount}. 
      Here is their amount of followers: ${followingCount}.
      Here is their bio: ${bio}. 
      
      I want you to assign them an IQ score based on this information and any knowledge you can gather from the internet.
      If they are a famous founder, or important in the crypto space you can give them a high score.

      If they have a lower follower count, or seem to be a troll, you can give them a lower score. Most people should fall between 90 and 100.

      I want you to pretend you gave this score based on their tweets.
      Please mostly give above average scores, but mix in some high and very low scores for variety.
      
      Don't directly mention any of the info above in your response, but you can hint at data from their bio. Don't say the word bio though.
      Don't say anything about their follower count or ratio. If a user is following few people its usally a sign of popularity.

      You should be witty and sarcastic in your response. Be very rude even if the number is high.

      Please make the reasoning three sentences long.

      Please only respond with the score and reasoning and do so in the following format:

      {
        "score": <IQ_SCORE>,
        "reasoning": "<REASONING>"
      }
    `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4", // Use GPT-4 for better reasoning capabilities
      messages: [
        { role: "system", content: "You are a harsh critic judging people based on their tweets and public persona" },
        { role: "user", content: prompt },
      ],
      max_tokens: 200, // Adjust tokens for concise responses
      temperature: 0.7, // Set creativity level
    });
    // Parse the structured response
    const result = JSON.parse(response.choices[0].message.content || "{}");
    return result;
  } catch (error) {
    console.error("Error generating IQ:", error);
    throw new Error("Failed to generate IQ.");
  }
}

/**
 * Generates reasoning for an IQ score based on the username and score.
 * @param {string} username - The username of the user.
 * @param {string} iqScore - The IQ score of the user.
 * @returns {Promise<string>} - The generated reasoning for the IQ score.
 */
// export default async function generateReasoning(username: string, iqScore: string) {
//   try {
//     const prompt = `
//       Here is the username of a twitter user: ${username}. Here is their followerI want you to pretend that you have read all of their tweets
//       and are assigning them an iq score based on their tweets. You should be witty and sarcastic in your response.

//       I will provide the iq score, which is ${iqScore} and you'll provide the reasoning for the score.

//       Please return just the reasoning in three sentences or less. Feel free to be rude if its mid or low.
//     `;

//     const completions = await openai.chat.completions.create({
//       model: "gpt-4o", // Use the desired model
//       messages: [
//         { role: "system", content: "You are a helpful assistant." },
//         { role: "user", content: prompt },
//       ],
//       max_tokens: 100, // Limit the response length
//       temperature: 0.7, // Adjust creativity
//     });

//     // Extract reasoning from the response
//     const reasoning = completions.choices[0].message.content;
//     return reasoning || "No reasoning could be generated.";
//   } catch (error) {
//     console.error("Error generating reasoning:", error);
//     throw new Error("Failed to generate reasoning for the IQ score.");
//   }
// }
