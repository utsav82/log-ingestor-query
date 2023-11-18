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

    res.status(200).json({
      status: "success",
      results: logs.length,
      data: {
        logs,
      },
    });
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
