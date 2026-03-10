import { ContainerRegistrationKeys, ExecArgs } from "@medusajs/framework/utils";

export default async function inspectApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  try {
    // Get all API keys
    const { data: allKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "type", "created_by", "last_used_at"],
    });

    logger.info(`Total API keys found: ${allKeys?.length || 0}`);

    if (allKeys && allKeys.length > 0) {
      allKeys.forEach((key, index) => {
        logger.info(`Key ${index + 1}:`);
        logger.info(`  ID: ${key.id}`);
        logger.info(`  Token: ${key.token}`);
        logger.info(`  Type: ${key.type}`);
        logger.info(`  Created By: ${key.created_by}`);
        logger.info(`  Last Used: ${key.last_used_at}`);
      });
    }

    // Try to get publishable keys specifically
    const { data: pubKeys } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "type"],
      filters: { type: "publishable" },
    });

    logger.info(`\nPublishable keys: ${pubKeys?.length || 0}`);
    pubKeys?.forEach((key) => {
      logger.info(`  Token: ${key.token}`);
    });
  } catch (error) {
    logger.error("Error inspecting API keys:", error);
  }
}
