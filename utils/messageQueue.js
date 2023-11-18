const amqp = require("amqplib");
const rabbitmqUrl = "amqp://rabbitmq:5672";
const queueName = "logQueue";
const Log = require("../models/logModal");
let rabbitmqConnection;
let rabbitmqChannel;

// connect with connectWithRetry

async function connectToRabbitMQ() {
  try {
    rabbitmqConnection = await amqp.connect(rabbitmqUrl);
    rabbitmqChannel = await rabbitmqConnection.createChannel();
    await rabbitmqChannel.assertQueue(queueName, { durable: false });
    console.log("Connected to RabbitMQ");
  } catch (error) {
    console.error(`Error connecting to RabbitMQ: ${error.message}`);
    setTimeout(connectToRabbitMQ, 5000);
  }
}

async function publishToQueue(logEntry) {
  try {
    // Ensure RabbitMQ connection is established
    if (!rabbitmqConnection) {
      await connectToRabbitMQ();
    }

    rabbitmqChannel.sendToQueue(
      queueName,
      Buffer.from(JSON.stringify(logEntry))
    );
    console.log(`Log entry sent to the queue`);
  } catch (error) {
    console.error(`Error publishing to the queue: ${error.message}`);
  }
}

async function consumeFromQueue() {
  try {
    // Ensure RabbitMQ connection is established
    if (!rabbitmqConnection) {
      await connectToRabbitMQ();
    }

    console.log("Waiting for log entries...");

    // Continuous loop to listen for messages
    rabbitmqChannel.consume(
      queueName,
      async (message) => {
        if (message !== null) {
          const logEntry = JSON.parse(message.content.toString());
          await Log.create(logEntry);
          console.log(`Processing log entry`);
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(`Error consuming from the queue: ${error.message}`);
  }
}

exports.publishToQueue = publishToQueue;
exports.consumeFromQueue = consumeFromQueue;
