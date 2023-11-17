const Log = require("../models/logModal");

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
    const log = await Log.create(req.body);

    res.status(200).json({
      status: "success",
      data: {
        log,
      },
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({
      status: "fail",
    });
  }
};

