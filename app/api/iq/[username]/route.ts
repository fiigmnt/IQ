import generateReasoning from "@/utils/generateReasoning";
import getUserInfo from "@/utils/getUserInfo";
import generateIQ from "@/utils/generateIQ";
import saveUserInfo from "@/utils/saveUserInfo";

// POST USER INFO ENDPOINT
export async function POST(request: Request, { params }: { params: { username: string } }) {
  const { username } = await params;

  // check if user exists in database
  const { success, data } = await getUserInfo(username);

  if (success) {
    return new Response(JSON.stringify({ success: true, data }), { status: 200 });

    // create a new IQ score and reasoning
  } else {
    const score = generateIQ();
    const reasoning = await generateReasoning(username, score.toString());

    try {
      await saveUserInfo(username, score.toString(), reasoning);

      return new Response(JSON.stringify({ success: true, data: { score, reasoning } }), { status: 200 });
    } catch (error) {
      console.error(error);
      return new Response(JSON.stringify({ success: false, message: "Unable to save data" }), { status: 500 });
    }
  }
}

// GET USER INFO ENDPOINT
export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = await params;

  if (!username) {
    return new Response(JSON.stringify({ success: false, message: "Username is required" }), { status: 400 });
  }

  try {

    const { success, data } = await getUserInfo(username);

    if (!success) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Unable to fetch data" }), { status: 500 });
  }
}

