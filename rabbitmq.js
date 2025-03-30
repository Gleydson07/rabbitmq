import amqp from "amqplib";

export const rabbitMQ = {
  connection: null,
  channel: null,
  lastMessage: null,
};

export async function connectRabbitMQ() {
  try {
    rabbitMQ.connection = await amqp.connect(process.env.RABBITMQ_URL);
    rabbitMQ.channel = await rabbitMQ.connection.createChannel();
    console.log("Conectado ao RabbitMQ");
  } catch (error) {
    console.error("Erro ao conectar ao RabbitMQ:", error);
  }
}
