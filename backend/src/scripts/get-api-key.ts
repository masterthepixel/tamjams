import { ContainerRegistrationKeys, ExecArgs } from "@medusajs/framework/utils";

export default async function getApiKey({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER);
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const { data } = await query.graph({
      entity: "api_key",
      fields: ["id", "token", "type", "created_by"],
    });

    if (data && data.length > 0) {
      const publishableKey = data.find((key) => key.type === "publishable");
      if (publishableKey) {
        logger.info(`Publishable API Key: ${publishableKey.token}`);
        logger.info(`Key ID: ${publishableKey.id}`);
        logger.info(`Type: ${publishableKey.type}`);
      } else {
        logger.warn("No publishable API key found");
      }
    } else {
      logger.warn("No API keys found in database");
    }
  } catch (error) {
    logger.error("Error retrieving API keys:", error);
  }
}
