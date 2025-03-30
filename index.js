// index.js
import express from "express";
import { connectRabbitMQ } from "./rabbitmq.js";
import queueRoutes from "./routes/queueRoutes.js";
import exchangeRoutes from "./routes/exchangeRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
import ackRoutes from "./routes/ackRoutes.js";
import * as dotenv from "dotenv";
import * as dotenvExpand from "dotenv-expand";

const myEnv = dotenv.config();
dotenvExpand.expand(myEnv);

const app = express();
app.use(express.json());

async function start() {
  await connectRabbitMQ();

  app.use("/queues", queueRoutes);
  app.use("/exchanges", exchangeRoutes);
  app.use("/messages", messageRoutes);
  app.use("/ack", ackRoutes);

  const PORT = process.env.APP_PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Servidor Express rodando na porta ${PORT}`);
  });
}

start();
