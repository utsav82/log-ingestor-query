const mongoose = require("mongoose");

const logSchema = new mongoose.Schema({
  level: {
    type: String,
    required: [true, "Log must have a level"],
  },
  message: {
    type: String,
    required: [true, "Log must have a message"],
  },
  resourceId: {
    type: String,
    required: [true, "Log must have a resourceId"],
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
