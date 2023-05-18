// terminal /usr/local/Cellar/rabbitmq/3.11.16/sbin/rabbitmq-server
const amqp = require("amqplib");

require("dotenv").config({ path: "../.env" });

async function consume_from_q_A() {
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
    const assertQueue = await channel.assertQueue(queueName, { durable: true });

    // Bind the queue to the exchange with the routing key pattern
    const routingKey_q_A = process.env.ROUTING_KEY;
    await channel.bindQueue(assertQueue.queue, exchangeName, routingKey_q_A);

    // Start consuming messages
    console.log(
      `Consumer started. Waiting for messages in queue ${queueName}...`
    );
    channel.consume(
      assertQueue.queue,
      (message) => {
        console.log(`Received message: ${message.content.toString()}`);
        channel.ack(message);
      },
      { noAck: false }
    );

    channel.on("error", (error) => {
      console.log("Channel error:", error);
    });

    channel.on("close", () => {
      console.log("Channel closed");
    });

    // Connection close event handling
    process.on("SIGINT", async () => {
      try {
        await connection.close();
        console.log("Connection closed");
        process.exit(0);
      } catch (error) {
        console.log("Error closing connection:", error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.log(error);
  }
}

consume_from_q_A();
