# EcoFinds Server (Node.js + MySQL)

## Setup
1. Ensure MySQL is running and create a database:
   ```sql
   CREATE DATABASE ecofinds CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
   ```
2. Copy `.env.example` to `.env` and fill in credentials.
3. Install dependencies:
   ```bash
   cd server
   npm install
   npm run dev
   ```
4. On first run, tables and default categories are auto-created.
