const amqp = require("amqplib");
const rabbitmqUrl = "amqp://rabbitmq:5672";
const queueName = "logQueue";
const Log = require("../models/logModal");
const maxRetryTime = 30000; // 30 seconds in milliseconds
let startTime;

// connect with connectWithRetry
let rabbitmqConnection;
let rabbitmqChannel;

// Function to establish RabbitMQ connection
async function connectToRabbitMQ() {
  try {
    rabbitmqConnection = await amqp.connect(rabbitmqUrl);
    rabbitmqChannel = await rabbitmqConnection.createChannel();
    await rabbitmqChannel.assertQueue(queueName, { durable: false });
    console.log("Connected to RabbitMQ");
    console.log("Waiting for log entries...");

    consumeFromQueue();
  } catch (error) {
    if (!startTime) {
      startTime = Date.now();
    }

    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < maxRetryTime) {
    } else {
      console.error(
        `Unable to connect to RabbitMQ ${error.message} , retrying....`
      );
    }
    setTimeout(connectToRabbitMQ, 5000);
  }
}

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
    console.error(`Error consuming from queue: ${error.message}`);
  }
}

exports.publishToQueue = publishToQueue;
exports.consumeFromQueue = consumeFromQueue;
exports.connectToRabbitMQ = connectToRabbitMQ;
