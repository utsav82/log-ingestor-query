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

# Log Ingestor and Query Interface

This project implements a log ingestor and a query interface in Node.js using an Express server.

## Components and Technologies Used

### Log Ingestor

- **Node.js and Express Server:**
  - Handles incoming requests and manages responses.
  
- **RabbitMQ Message Queue:**
  - Logs are forwarded to a message queue upon receipt.
  - A subscriber consumes these logs and writes them to the database.

- **MongoDB (Sharded):**
  - Efficiently manages vast amounts of log data.
  - Sharded MongoDB with 3 config servers and 2 shards for scalability.
  - Timestamps are indexed to optimize write performance.

### Load Balancing

- **Nginx:**
  - Load balances multiple Node.js servers to handle requests at scale.
  - Distributes incoming requests to different instances of the Node.js app.

### Query Interface

- **HTML Form:**
  - Implemented at `localhost:3000/` for user-friendly interaction.
  - Handles POST and GET requests at `/log`.

### Docker and Docker Compose

- **Containerization:**
  - Docker is used to manage different images and containers.
  - Docker Compose simplifies multi-container Docker applications.

## Project Setup

### Prerequisites

- Node.js (version X.X.X)
- npm (version X.X.X)
- Docker (version X.X.X)
- Docker Compose (version X.X.X)
- RabbitMQ
- MongoDB (Sharded)

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/log-ingestor.git
    cd log-ingestor
    ```

2. **Install dependencies:**
    ```bash
    npm install
    ```

3. **Run the application:**
    ```bash
    docker-compose up
    ```

## Usage

- Access the log ingestor at [http://localhost:3000](http://localhost:3000).
- The query interface is available at [http://localhost:3000/log](http://localhost:3000/log).

## Contribution Guidelines

Contributions are welcome! Follow these steps:

1. Fork the repository
2. Create a new branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the [MIT License](LICENSE).


