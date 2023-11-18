const express = require("express");
const cors = require("cors");
const logsRouter = require("./routes/logsRouter");
const {connectWithRetry} = require("./utils/mongoose");
const {consumeFromQueue} = require("./utils/messageQueue");

connectWithRetry();
const app = express();
app.enable("trust proxy");
app.use(cors({}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello world");
});
app.use("/log", logsRouter);

// Start consuming log entries from the message queue
consumeFromQueue();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`listening on port ${port}`));
