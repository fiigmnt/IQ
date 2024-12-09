// USER INFO ENDPOINT
import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, GetCommand } from "@aws-sdk/lib-dynamodb";

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export default async function getUserInfo(username: string) {

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
      return { success: false, message: "User not found" };
    }

    const { score, reasoning, image } = result.Item;

    return { success: true, data: { score, reasoning, image, username } };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Unable to fetch data" };
  }
}