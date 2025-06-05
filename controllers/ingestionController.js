const { v4: uuidv4 } = require("uuid");
const { enqueueBatches, getStatusByIngestionId } = require("../queue/queueManager");

// POST /ingest
const enqueueIngestion = (req, res) => {
  const { ids, priority } = req.body;

  if (!ids || !Array.isArray(ids) || ids.length === 0) {
    return res.status(400).json({ error: "ids must be a non-empty array" });
  }
  if (!["HIGH", "MEDIUM", "LOW"].includes(priority)) {
    return res.status(400).json({ error: "priority must be one of HIGH, MEDIUM, LOW" });
  }

  // Generate unique ingestion ID
  const ingestionId = uuidv4();

  // Split ids into batches of 3
  const batches = [];
  for (let i = 0; i < ids.length; i += 3) {
    batches.push(ids.slice(i, i + 3));
  }

  // Enqueue batches with ingestionId and priority
  enqueueBatches(ingestionId, priority, batches);

  res.json({ ingestion_id: ingestionId });
};

// GET /status/:ingestionId
const getIngestionStatus = (req, res) => {
  const { ingestionId } = req.params;

  const statusData = getStatusByIngestionId(ingestionId);

  if (!statusData) {
    return res.status(404).json({ error: "Ingestion ID not found" });
  }

  res.json(statusData);
};

module.exports = { enqueueIngestion, getIngestionStatus };
