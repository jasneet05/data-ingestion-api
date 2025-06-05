const express = require("express");
const ingestionRoutes = require("./routes/ingestionRoutes");

const app = express();

app.use(express.json());

app.use("/ingest", ingestionRoutes);

// Health check or base route
app.get("/", (req, res) => {
  res.send("Data Ingestion API is running.");
});

module.exports = app;
