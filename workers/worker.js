const { processNextBatch } = require("../queue/queueManager");

let isProcessing = false;

const startWorker = () => {
  if (isProcessing) return;
  isProcessing = true;

  // Process one batch every 5 seconds respecting rate limit
  setInterval(async () => {
    try {
      await processNextBatch();
    } catch (err) {
      console.error("Error processing batch:", err);
    }
  }, 5000);
};

module.exports = startWorker;
