const { connectWithRetry } = require("./utils/mongoose");
const { connectToRabbitMQ, consumeFromQueue } = require("./utils/messageQueue");

connectWithRetry();
connectToRabbitMQ("ingestor");
