// routes/exchangeRoutes.js
import { Router } from "express";
import { rabbitMQ } from "../rabbitmq.js";

const router = Router();

// Cria (assert) uma exchange
router.post("/", async (req, res) => {
  const { exchange, type, options } = req.body;
  try {
    const result = await rabbitMQ.channel.assertExchange(
      exchange,
      type,
      options
    );
    res.status(200).json({ message: "Exchange criada ou verificada", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deleta uma exchange
router.delete("/:exchange", async (req, res) => {
  const { exchange } = req.params;
  const { options } = req.body;
  try {
    const result = await rabbitMQ.channel.deleteExchange(exchange, options);
    res.status(200).json({ message: "Exchange deletada", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Liga (bind) uma exchange a outra
router.post("/:destination/bind", async (req, res) => {
  const { destination } = req.params;
  const { source, pattern, args } = req.body;
  try {
    const result = await rabbitMQ.channel.bindExchange(
      destination,
      source,
      pattern,
      args
    );
    res
      .status(200)
      .json({
        message: `Exchange ${destination} ligada à exchange ${source}`,
        result,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desliga (unbind) uma exchange de outra
router.post("/:destination/unbind", async (req, res) => {
  const { destination } = req.params;
  const { source, pattern, args } = req.body;
  try {
    const result = await rabbitMQ.channel.unbindExchange(
      destination,
      source,
      pattern,
      args
    );
    res
      .status(200)
      .json({
        message: `Exchange ${destination} desassociada da exchange ${source}`,
        result,
      });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
