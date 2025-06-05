const { v4: uuidv4 } = require("uuid");

// In-memory data stores (replace with DB if needed)
const ingestionStore = {};
const batchQueue = [];

// Priority mapping for sorting
const priorityMap = { HIGH: 1, MEDIUM: 2, LOW: 3 };

// Enqueue batches for processing
function enqueueBatches(ingestionId, priority, batches) {
  ingestionStore[ingestionId] = {
    ingestion_id: ingestionId,
    status: "yet_to_start",
    batches: batches.map((ids) => ({
      batch_id: uuidv4(),
      ids,
      status: "yet_to_start",
    })),
    createdAt: Date.now(),
    priority,
  };

  // Add batches to queue with priority & createdAt for sorting
  batches.forEach((ids, i) => {
    batchQueue.push({
      ingestionId,
      batch_id: ingestionStore[ingestionId].batches[i].batch_id,
      ids,
      priority,
      createdAt: ingestionStore[ingestionId].createdAt,
      status: "yet_to_start",
    });
  });

  sortQueue();
}

// Sort queue by priority then createdAt
function sortQueue() {
  batchQueue.sort((a, b) => {
    if (priorityMap[a.priority] !== priorityMap[b.priority]) {
      return priorityMap[a.priority] - priorityMap[b.priority];
    }
    return a.createdAt - b.createdAt;
  });
}

// Process next batch (called every 5 seconds by worker)
async function processNextBatch() {
  if (batchQueue.length === 0) return;

  const batch = batchQueue.shift();

  // Update batch and ingestion status to triggered
  updateBatchStatus(batch.ingestionId, batch.batch_id, "triggered");

  // Simulate processing: 1 second delay per id
  for (const id of batch.ids) {
    await simulateExternalAPI(id);
  }

  updateBatchStatus(batch.ingestionId, batch.batch_id, "completed");

  updateIngestionStatus(batch.ingestionId);
}

// Simulate fetching external API data with delay and static response
function simulateExternalAPI(id) {
  return new Promise((resolve) => {
    setTimeout(() => {
      // Here we could do more, but just simulating
      resolve({ id, data: "processed" });
    }, 1000);
  });
}

// Update batch status in store
function updateBatchStatus(ingestionId, batchId, status) {
  const ingestion = ingestionStore[ingestionId];
  if (!ingestion) return;
  const batch = ingestion.batches.find((b) => b.batch_id === batchId);
  if (!batch) return;
  batch.status = status;
}

// Update ingestion overall status based on batches
function updateIngestionStatus(ingestionId) {
  const ingestion = ingestionStore[ingestionId];
  if (!ingestion) return;

  const batchStatuses = ingestion.batches.map((b) => b.status);

  if (batchStatuses.every((s) => s === "yet_to_start")) {
    ingestion.status = "yet_to_start";
  } else if (batchStatuses.every((s) => s === "completed")) {
    ingestion.status = "completed";
  } else {
    ingestion.status = "triggered";
  }
}

// Get ingestion status by ID
function getStatusByIngestionId(ingestionId) {
  return ingestionStore[ingestionId];
}

module.exports = {
  enqueueBatches,
  processNextBatch,
  getStatusByIngestionId,
};
