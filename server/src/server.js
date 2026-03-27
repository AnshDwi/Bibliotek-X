import http from "http";

import { createApp } from "./app.js";
import { connectDatabase } from "./config/database.js";
import { env } from "./config/env.js";
import { registerSocketServer } from "./socket/index.js";

const bootstrap = async () => {
  await connectDatabase();

  const app = createApp();
  const server = http.createServer(app);

  registerSocketServer(server);

  server.listen(env.port, () => {
    console.log(`Bibliotek X API listening on port ${env.port}`);
  });
};

bootstrap().catch((error) => {
  console.error("Failed to bootstrap Bibliotek X", error);
  process.exit(1);
});

