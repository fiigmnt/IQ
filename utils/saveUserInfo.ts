import { Resource } from "sst";
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const ddb = DynamoDBDocumentClient.from(client);

export default async function saveUserInfo(username: string, score: string, reasoning: string, image: string) {
  try {
    await ddb.send(
      new PutCommand({
        TableName: Resource.UserData.name,
        Item: {
          username,
          score,
          reasoning,
          image,
        },
      })
    );
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to save user info" };
  }
}
