// USER INFO ENDPOINT
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export async function GET(request: Request, { params }: { params: { username: string } }) {
  const { username } = await params;

  if (!username) {
    return new Response(JSON.stringify({ success: false, message: "Username is required" }), { status: 400 });
  }

  try {
    // Fetch the user data from DynamoDB
    const result = await ddb.send(
      new GetCommand({
        TableName: Resource.UserData.name, // Replace with your table reference
        Key: { username }, // Use the username as the partition key
      })
    );

    // Check if the user exists
    if (!result.Item) {
      return new Response(JSON.stringify({ success: false, message: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ success: true, data: result.Item }), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ success: false, message: "Unable to fetch data" }), { status: 500 });
  }
}
