const express = require("express");
const cors = require("cors");
const logsRouter = require("./routes/logsRouter");
const { connectWithRetry } = require("./utils/mongoose");
const { connectToRabbitMQ } = require("./utils/messageQueue");

connectWithRetry();
const app = express();
app.enable("trust proxy");
app.use(cors({}));
app.use(express.json());
app.use(express.static("public"));
app.get("/", (req, res) => {
  console.log("GET /");
});
app.use("/log", logsRouter);

// Start consuming log entries from the message queue
connectToRabbitMQ();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));