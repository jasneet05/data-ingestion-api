const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  batchId: String,
  ids: [Number],
  status: { type: String, enum: ['yet_to_start', 'triggered', 'completed'], default: 'yet_to_start' }
});

const ingestionSchema = new mongoose.Schema({
  ingestionId: String,
  priority: { type: String, enum: ['HIGH', 'MEDIUM', 'LOW'] },
  timestamp: { type: Date, default: Date.now },
  batches: [batchSchema],
});

module.exports = mongoose.model("Ingestion", ingestionSchema);
