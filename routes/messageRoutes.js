// routes/messageRoutes.js
import { Router } from "express";
import { rabbitMQ } from "../rabbitmq.js";

const router = Router();

// Publica uma mensagem em uma exchange com uma routing key
router.post("/publish", async (req, res) => {
  const { exchange, routingKey, message, options } = req.body;
  try {
    const published = rabbitMQ.channel.publish(
      exchange,
      routingKey,
      Buffer.from(message),
      options
    );
    if (published) {
      res.status(200).json({ message: "Mensagem publicada" });
    } else {
      res.status(500).json({ error: "Falha ao publicar a mensagem" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Consome mensagens de uma fila
router.post("/consume", async (req, res) => {
  const { queue, noAck = false } = req.body;
  try {
    await rabbitMQ.channel.consume(
      queue,
      (msg) => {
        if (msg) {
          console.log(`Mensagem recebida: ${msg.content.toString()}`);
          if (!noAck) {
            rabbitMQ.lastMessage = msg;
          }
        }
      },
      { noAck }
    );
    res.status(200).json({ message: `Consumindo mensagens da fila ${queue}` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post("/ack", (req, res) => {
  const { allUpTo = false } = req.body;
  if (rabbitMQ.lastMessage) {
    try {
      rabbitMQ.channel.ack(rabbitMQ.lastMessage, allUpTo);
      res.status(200).json({ message: "Mensagem confirmada (ack)" });
      rabbitMQ.lastMessage = null;
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res
      .status(400)
      .json({ error: "Nenhuma mensagem disponível para confirmação" });
  }
});

// Rejeita (nack) a última mensagem consumida
router.post("/nack", (req, res) => {
  const { allUpTo = false, requeue = false } = req.body;
  if (rabbitMQ.lastMessage) {
    try {
      rabbitMQ.channel.nack(rabbitMQ.lastMessage, allUpTo, requeue);
      res.status(200).json({ message: "Mensagem rejeitada (nack)" });
      rabbitMQ.lastMessage = null;
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res
      .status(400)
      .json({ error: "Nenhuma mensagem disponível para rejeição" });
  }
});

export default router;
