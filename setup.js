const amqp = require("amqplib");
const path = require("path");
require("dotenv").config({
  path: path.resolve(__dirname, "./env/rabbitmq.env"),
});

const axios = require("axios");

async function setupRabbitMQ() {
  const baseUrl = "http://guest:guest@messaging:15672/api";

  const auth = {
    username: "guest",
    password: "guest",
  };

  const exchangeName = process.env.EXCHANGE_NAME;
  const queueName = process.env.QUEUE_NAME;
  const routingKey = process.env.ROUTING_KEY;

  try {
    // Create the exchange
    await axios.put(
      `${baseUrl}/exchanges/%2f/${exchangeName}`,
      {
        type: "topic",
        durable: true,
      },
      { auth }
    );

    // Create the queue
    await axios.put(
      `${baseUrl}/queues/%2f/${queueName}`,
      {
        durable: true,
      },
      { auth }
    );

    // Bind the queue to the exchange
    await axios.post(
      `${baseUrl}/bindings/%2f/e/${exchangeName}/q/${queueName}`,
      {
        routing_key: routingKey,
      },
      { auth }
    );

    console.log("RabbitMQ setup completed successfully!");
  } catch (error) {
    console.error("RabbitMQ setup failed:", error);
  }
}

setupRabbitMQ();
