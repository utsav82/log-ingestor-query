# Log Ingestor and Query Interface

This project implements a log ingestor system and a query interface. The system efficiently handles vast volumes of log data and provides a simple interface for querying data using full-text search or specific field filters.

## Table of Contents

- [Features](#features)
  - [Log Ingestor](#log-ingestor)
  - [Query Interface](#query-interface)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
- [Usage](#usage)
  - [Log Ingestor](#log-ingestor-usage)
  - [Query Interface](#query-interface-usage)

## Features

### Log Ingestor

- Ingest logs in the provided JSON format.
- Scalable design to handle high volumes of logs.
- Mitigate potential bottlenecks, such as I/O operations and database write speeds.
- Log ingestion via an HTTP server running on port `3000` by default.

### Query Interface

- User interface (Web UI or CLI) for full-text search across logs.
- Filters based on:
  - level
  - message
  - resourceId
  - timestamp
  - traceId
  - spanId
  - commit
  - metadata.parentResourceId
- Efficient and quick search results.

## Getting Started

### Prerequisites

- Node.js (version X.X.X)
- npm (version X.X.X)
- MongoDB (version X.X.X)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/your-username/log-ingestor.git
    cd log-ingestor
    ```

2. Install dependencies:

    ```bash
    npm install
    ```

## Usage

### Log Ingestor

#### Log Ingestor Usage

To start the log ingestor server:

```bash
npm run start-ingestor
