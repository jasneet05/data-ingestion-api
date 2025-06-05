const express = require("express");
const { enqueueIngestion, getIngestionStatus } = require("../controllers/ingestionController");

const router = express.Router();

router.post("/", enqueueIngestion);
router.get("/:ingestionId", getIngestionStatus);

module.exports = router;
