// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "iq",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    // Create a user dynamo table
    const userTable = new sst.aws.Dynamo("UserData", {
      fields: {
        username: "string", // Partition key
      },
      primaryIndex: { hashKey: "username" },
    });

    // Create a rate limit dynamo table
    const rateLimitTable = new sst.aws.Dynamo("RateLimitData", {
      fields: {
        ip: "string", // Partition key
      },
      primaryIndex: { hashKey: "ip" },
    });

    // Create a Next.js site
    new sst.aws.Nextjs("IQSite", {
      domain: {
        name: "iqcheck.fun",
        redirects: ["www.iqcheck.fun"]
      },
      environment: {
        RATE_LIMIT_TABLE_NAME: rateLimitTable.name,
        USER_TABLE_NAME: userTable.name,
      },
      link: [userTable, rateLimitTable],
    });
  },
});
