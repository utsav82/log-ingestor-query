const Log = require("../models/logModal");
const { publishToQueue } = require("../utils/messageQueue");

exports.getLogs = async (req, res, next) => {
  try {
    const {
      level,
      message,
      resourceId,
      timestamp,
      traceId,
      spanId,
      commit,
      parentResourceId,
    } = req.query;

    const query = {};
    if (level) query.level = level;
    if (message) query.message = { $regex: new RegExp(message, "i") }; // Case-insensitive search
    if (resourceId) query.resourceId = resourceId;
    if (timestamp) query.timestamp = timestamp;
    if (traceId) query.traceId = traceId;
    if (spanId) query.spanId = spanId;
    if (commit) query.commit = commit;
    if (parentResourceId) query["metadata.parentResourceId"] = parentResourceId;

    const logs = await Log.find(query);
    if (req.get("Accept").includes("text/html")) {
      res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Form Submission Response</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            width: 100vw;
          }
  
          h1 {
            text-align: center;
            color: #333;
          }
  
          pre {
            background-color: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            font-size: 14px;
            overflow-x: auto;
            width: 50%;
          }
        </style>
      </head>
      <body>
        <h1>Form Response</h1>
        <pre>${JSON.stringify(logs, null, 2)}</pre>
      </body>
      </html>
      `);
    } else {
      res.status(200).json({
        status: "success",
        results: logs.length,
        data: {
          logs,
        },
      });
    }
  } catch (e) {
    res.status(400).json({
      status: "fail",
    });
  }
};

exports.createLog = async (req, res, next) => {
  try {
    const logEntry = req.body;

    await publishToQueue(logEntry);

    res
      .status(200)
      .json({ message: "Log entry received and queued for processing" });
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
};
