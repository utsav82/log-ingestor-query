const Log = require("../models/logModal");
const { publishToQueue } = require("../utils/messageQueue");

exports.getAllLogs = async (req, res, next) => {
  try {
    const logs = await Log.find();

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
