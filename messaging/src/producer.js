const amqp = require("amqplib");
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

async function produceToQueue(message) {
  try {
    // Connect to RabbitMQ server
    const connection = await amqp.connect(process.env.RABBITMQ_URL);

    // Create a channel
    const channel = await connection.createChannel();

    // Create the topic exchange
    const exchangeName = process.env.EXCHANGE_NAME;
    await channel.assertExchange(exchangeName, "topic", { durable: true });

    // Create the queue
    const queueName = process.env.QUEUE_NAME;
    await channel.assertQueue(queueName, { durable: true });

    // Bind the queue to the exchange with the routing key
    const routingKey = process.env.ROUTING_KEY;
    await channel.bindQueue(queueName, exchangeName, routingKey);

    // Publish message to the queue
    const messageString = JSON.stringify(message);
    channel.publish(exchangeName, routingKey, Buffer.from(messageString), {
      persistent: true,
    });

    console.log(`Message sent to queue '${queueName}': ${messageString}`);

    // Close the channel and connection
    await channel.close();
    await connection.close();
  } catch (error) {
    console.log(error);
  }
}

// Example usage:
const message = {
  id: 1,
  data: "Hello, RabbitMQ!",
};

produceToQueue(message);
