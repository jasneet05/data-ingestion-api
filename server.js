const app = require("./app");
const connectDB = require("./config/db");
const startWorker = require("./workers/worker");

connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server running on port 5000");
    startWorker();
  });
}).catch(err => {
  console.error("Failed to connect to DB", err);
});
