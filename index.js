const express = require("express");
const cors = require("cors");
const logsRouter = require("./routes/logsRouter");
const { connectWithRetry } = require("./utils/mongoose");
const { connectToRabbitMQ } = require("./utils/messageQueue");

connectWithRetry();
const app = express();
app.enable("trust proxy");
app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get("/test", (req, res) => {
  console.log("test")
  res.send("test");
});

app.use("/log", logsRouter);

connectToRabbitMQ();

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));
