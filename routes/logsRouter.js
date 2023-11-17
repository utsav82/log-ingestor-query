const express = require("express");
const logsController = require("../controllers/logController");
const router = express.Router();
router
  .route("/")
  .get(logsController.getAllLogs)
  .post(logsController.createLog);

module.exports = router;
