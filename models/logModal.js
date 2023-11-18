const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: {
    type: String,
  },
  message: {
    type: String,
  },
  resourceId: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  traceId: {
    type: String,
  },
  spanId: {
    type: String,
  },
  commit: {
    type: String,
  },
  metadata: {
    parentResourceId: {
      type: String,
    },
  },
});

logSchema.index({ timestamp: 1 });

const Log = mongoose.model("Log", logSchema);
module.exports = Log;
