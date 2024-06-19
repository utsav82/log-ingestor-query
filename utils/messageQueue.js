const amqp = require("amqplib");
const rabbitmqUrl = "amqp://rabbitmq:5672";
const queueName = "logQueue";
const Log = require("../models/logModal");
const maxRetryTime = 30000; // 30 seconds
let startTime;

let rabbitmqConnection;
let rabbitmqChannel;

async function connectToRabbitMQ() {
  try {
    rabbitmqConnection = await amqp.connect(rabbitmqUrl);
    rabbitmqChannel = await rabbitmqConnection.createChannel();
    await rabbitmqChannel.assertQueue(queueName);
    console.log("Connected to RabbitMQ");
    console.log("Waiting for log entries...");

    consumeFromQueue();
  } catch (error) {
    if (!startTime) {
      startTime = Date.now();
    }

    const elapsedTime = Date.now() - startTime;

    if (elapsedTime < maxRetryTime) {
      setTimeout(connectToRabbitMQ, 5000);
    } else {
      console.error(`Unable to connect to RabbitMQ after ${maxRetryTime / 1000} seconds: ${error.message}`);
    }
  }
}

async function publishToQueue(logEntry) {
  try {
    if (!rabbitmqChannel) throw new Error("RabbitMQ channel is not established.");
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
    if (!rabbitmqChannel) throw new Error("RabbitMQ channel is not established.");
    rabbitmqChannel.consume(
      queueName,
      async (message) => {
        if (message !== null) {
          const logEntry = JSON.parse(message.content.toString());
          try {
            await Log.create(logEntry);
            console.log(`Processed log entry`);
          } catch (err) {
            console.error(`Error processing log entry: ${err.message}`);
          }
        }
      },
      { noAck: true }
    );
  } catch (error) {
    console.error(`Error consuming from queue: ${error.message}`);
  }
}

process.on('SIGINT', async () => {
  console.log('SIGINT received. Closing RabbitMQ connection.');
  if (rabbitmqChannel) await rabbitmqChannel.close();
  if (rabbitmqConnection) await rabbitmqConnection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Closing RabbitMQ connection.');
  if (rabbitmqChannel) await rabbitmqChannel.close();
  if (rabbitmqConnection) await rabbitmqConnection.close();
  process.exit(0);
});

exports.publishToQueue = publishToQueue;
exports.consumeFromQueue = consumeFromQueue;
exports.connectToRabbitMQ = connectToRabbitMQ;
