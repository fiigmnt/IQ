import generateReasoning from "./generateReasoning";
import getUserInfo from "./getUserInfo";
import generateIQ from "./generateIQ";
import saveUserInfo from "./saveUserInfo";
import getTwitterData from "./getTwitterData";
import generateReasoningFromScore from "./generateReasoningFromScore";
import checkWhitelist from "./checkWhitelist";
import setChecks from "./setChecks";

export function createTwitterPostUrl(username: string, score: string, category: string) {
  const tweetText = `.@${username} has an IQ of ${score}. They are ${category} 🧠
  
  Think you can beat them? Test your IQ now at @iqcheckdotfun #IQ"`;

  const encodedTweetText = encodeURIComponent(tweetText);
  const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodedTweetText}`;

  return twitterIntentUrl;
}

export {
  generateReasoning,
  generateReasoningFromScore,
  getUserInfo,
  generateIQ,
  saveUserInfo,
  getTwitterData,
  checkWhitelist,
  setChecks,
};
