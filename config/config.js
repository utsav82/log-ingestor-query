module.exports = {
  MONGO_IP: process.env.MONGO_IP || "mongodb",
  MONGO_PORT: process.env.MONGO_PORT || 27017,
  MONGO_USER: process.env.MONGO_USER,
  MONGO_PASSWORD: process.env.MONGO_PASSWORD,
  RABBITMQ_URL: process.env.RABBITMQ_URL || "amqp://rabbitmq:5672",
  QUEUE_NAME: process.env.QUEUE_NAME || "logQueue",
};
