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
    // Create a new DynamoDB table
    const table = new sst.aws.Dynamo("UserData", {
      fields: {
        username: "string", // Partition key
      },
      primaryIndex: { hashKey: "username" },
    });

    // Create a Next.js site
    new sst.aws.Nextjs("IQSite", {
      environment: {
        TABLE_NAME: table.name, // Pass table name to environment
      },
      link: [table]
    });
  },
});
