import { generateReasoning, generateReasoningFromScore, getTwitterData, getUserInfo, checkWhitelist, saveUserInfo } from "@/utils";

// POST USER INFO ENDPOINT
export async function POST(request: Request, { params }: { params: Promise<{ username: string }> }) {
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

// TODO: potentioally remove this endpoint
// GET USER INFO ENDPOINT
// export async function GET(request: Request, { params }: { params: { username: string } }) {
//   const { username } = await params;

//   if (!username) {
//     return new Response(JSON.stringify({ success: false, message: "Username is required" }), { status: 400 });
//   }

//   try {
//     const { success, data } = await getUserInfo(username);

//     if (!success) {
//       return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
//     }

//     return new Response(JSON.stringify({ success: true, data }), { status: 200 });
//   } catch (error) {
//     console.error(error);
//     return new Response(JSON.stringify({ success: false, message: "Unable to fetch data" }), { status: 500 });
//   }
// }
