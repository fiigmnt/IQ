import { generateReasoning, generateReasoningFromScore, getTwitterData, getUserInfo, checkWhitelist, saveUserInfo, rateLimit } from "@/utils";

// POST USER INFO ENDPOINT
export async function POST(request: Request, { params }: { params: Promise<{ username: string }> }) {
  try {
        // Extract IP address
        const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || // Handles proxy headers
        request.headers.get("cf-connecting-ip") || // Cloudflare
        request.headers.get("client-ip") || // AWS ALB
        "unknown";
  
      if (ip === "unknown") {
        return new Response(
          JSON.stringify({ success: false, message: "Unable to determine IP address" }),
          { status: 400 }
        );
      }
  
      // Apply rate limiting
      const { success, message } = await rateLimit(ip);
  
      if (!success) {
        return new Response(JSON.stringify({ success: false, message }), { status: 429 });
      }
  
  } catch (error) {
    console.error("Rate limiting error:", error);
    return new Response(JSON.stringify({ success: false, message: "Internal server error during rate limiting" }), { status: 500 });
  }

  try {
    // get username from params
    const { username } = await params;

    // check if user exists in database
    const { success, data } = await getUserInfo(username);

    if (success) {
      return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    }

    // fetch Twitter data
    const { success: twitterSuccess, data: twitterData } = await getTwitterData(username);

    // return error if no twitter data
    if (!twitterSuccess || !twitterData) {
      return new Response(JSON.stringify({ success: false, message: "Failed to fetch Twitter data" }), { status: 500 });
    }

    // extract data from twitter response
    const { image, followerCount, followingCount, bio } = twitterData;

    // check whitelist
    const whiteListScore = checkWhitelist(username);

    // generate score and reasoning
    const { score, reasoning } = whiteListScore ? await generateReasoningFromScore(username, whiteListScore) : await generateReasoning(username, followerCount, followingCount, bio);

    await saveUserInfo(username, score.toString(), reasoning, image);

    return new Response(JSON.stringify({ success: true, data: { score, reasoning, image, username } }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Unable to generate response" }), { status: 500 });
  }
}