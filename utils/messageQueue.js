const amqp = require("amqplib");
const rabbitmqUrl = "amqp://rabbitmq:5672";
const queueName = "logQueue";
const Log = require("../models/logModal");
const { set } = require("mongoose");
let rabbitmqConnection;
let rabbitmqChannel;

// connect with connectWithRetry

async function publishToQueue(logEntry) {
  try {
    // Ensure RabbitMQ connection is established
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
    rabbitmqConnection = await amqp.connect(rabbitmqUrl);
    rabbitmqChannel = await rabbitmqConnection.createChannel();
    await rabbitmqChannel.assertQueue(queueName, { durable: false });
    console.log("Connected to RabbitMQ");
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
    console.error(`Trying to reconnect to RabbitMQ: ${error.message}`);
    setTimeout(consumeFromQueue, 5000);

  }
}

exports.publishToQueue = publishToQueue;
exports.consumeFromQueue = consumeFromQueue;
