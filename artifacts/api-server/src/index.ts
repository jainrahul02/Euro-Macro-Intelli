import "dotenv/config"; // 👈 Loads .env variables automatically
import app from "./app";
import { logger } from "./lib/logger";

// Uses process.env.PORT from .env (or deployment server), or falls back to 3000
const rawPort = 8080;
const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening on port " + port);
});