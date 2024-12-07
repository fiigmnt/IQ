import whitelist from "@/data/whitelist.json";

export default function checkWhitelist(username: string) {
  const result = whitelist.find((user) => user.username === username);

  if (result) {
    return result.score.toString();
  }
  return null;
}
