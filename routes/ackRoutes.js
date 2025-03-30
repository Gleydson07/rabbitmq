// routes/ackRoutes.js
import { Router } from "express";
import { rabbitMQ } from "../rabbitmq.js";

const router = Router();

// Confirma (ack) a última mensagem consumida
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
