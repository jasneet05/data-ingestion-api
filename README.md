# Data Ingestion API

A simple RESTful API system to ingest and process data asynchronously in batches with priority-based scheduling and rate limiting.

---

## Features

- **POST `/ingest`**: Submit a list of IDs with priority for data ingestion.
- **GET `/ingest/:ingestionId`**: Check the status of your ingestion request.
- Processes IDs in batches of 3 asynchronously.
- Priority-based batch processing (`HIGH`, `MEDIUM`, `LOW`).
- Rate limiting: Processes one batch every 5 seconds.
- Simulates fetching data from an external API with delay.
- Tracks batch and ingestion statuses (`yet_to_start`, `triggered`, `completed`).
- Uses MongoDB for persistence (configurable via environment variables).

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [MongoDB](https://www.mongodb.com/) instance running locally or remotely

### Installation

1. Clone the repository

```bash
git clone https://github.com/jasneet05/data-ingestion-api
cd data-ingestion-api
