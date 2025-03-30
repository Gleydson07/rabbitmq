// routes/queueRoutes.js
import { Router } from "express";
import { rabbitMQ } from "../rabbitmq.js";

const router = Router();

// Cria (assert) uma fila
router.post("/", async (req, res) => {
  const { queue, options } = req.body;
  try {
    const result = await rabbitMQ.channel.assertQueue(queue, options);
    res.status(200).json({ message: "Fila criada ou verificada", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Deleta uma fila
router.delete("/:queue", async (req, res) => {
  const { queue } = req.params;
  const { options } = req.body; // opções são opcionais
  try {
    const result = await rabbitMQ.channel.deleteQueue(queue, options);
    res.status(200).json({ message: "Fila deletada", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Purga (limpa) uma fila
router.post("/:queue/purge", async (req, res) => {
  const { queue } = req.params;
  try {
    const result = await rabbitMQ.channel.purgeQueue(queue);
    res.status(200).json({ message: "Fila limpa", result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Liga (bind) uma fila a uma exchange
router.post("/:queue/bind", async (req, res) => {
  const { queue } = req.params;
  const { source, pattern, args } = req.body;

  try {
    const result = await rabbitMQ.channel.bindQueue(
      queue,
      source,
      pattern,
      args
    );
    res
      .status(200)
      .json({ message: `Fila ${queue} ligada à exchange ${source}`, result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Desliga (unbind) uma fila de uma exchange
router.post("/:queue/unbind", async (req, res) => {
  const { queue } = req.params;
  const { source, pattern, args } = req.body;
  try {
    const result = await rabbitMQ.channel.unbindQueue(
      queue,
      source,
      pattern,
      args
    );
    res.status(200).json({
      message: `Fila ${queue} desassociada da exchange ${source}`,
      result,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Lista todas as filas
router.get("/", async (req, res) => {
  try {
    const queues = await rabbitMQ.channel.checkQueue();
    res.status(200).json({ queues });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
