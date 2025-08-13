import { CosmosClient } from "@azure/cosmos";

const endpoint = process.env.COSMOS_DB_ENDPOINT;
const key = process.env.COSMOS_DB_KEY;
const databaseId = process.env.COSMOS_DB_DATABASE_ID;

if (!endpoint || !key || !databaseId) {
  throw new Error("Cosmos DB environment variables are not fully set.");
}

const client = new CosmosClient({ endpoint, key });

// Function to ensure database and containers exist
export const initializeDatabase = async () => {
  const { database } = await client.databases.createIfNotExists({ id: databaseId });
  
  // List of containers to create
  const containers = [
    process.env.COSMOS_DB_USERS_CONTAINER_ID,
    process.env.COSMOS_DB_PRODUCTS_CONTAINER_ID,
    process.env.COSMOS_DB_ORDERS_CONTAINER_ID,
    process.env.COSMOS_DB_POSTS_CONTAINER_ID,
  ];

  for (const containerId of containers) {
    if (containerId) {
      await database.containers.createIfNotExists({ id: containerId });
      console.log(`Container '${containerId}' is ready.`);
    }
  }
};

// Export the client for use in other services/functions
export const cosmosClient = client;
export const dbId = databaseId;
