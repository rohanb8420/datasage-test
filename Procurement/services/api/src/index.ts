import express from "express";
import path from "path";
import dotenv from "dotenv";
dotenv.config();
import "reflect-metadata";
import { AppDataSource } from "./data-source";
import dashboardRouter from "./routes/dashboard";
import hrRouter from "./routes/hr";
import billingRouter from "./routes/billing";
import expensesRouter from "./routes/expenses";
import chatRouter from "./routes/chat";
import pulseRouter from "./routes/pulse";
const app = express();
const port = process.env.PORT || 3000;
// Configure middleware and routes
import expressStatic from "express";
// Serve Pulse aggregated CSVs under /api/pulse/data
// import morgan from "morgan"; // temporarily disabled
// Log all requests to help debug Pulse/Chat usage
// app.use(morgan('dev')); // temporarily disabled
app.use(express.json());
// Serve Pulse's aggregated CSVs via API (avoiding CRA public folder)
app.use(
  '/api/pulse/data',
  express.static(path.resolve(__dirname, 'pulse/aggregate'))
);
// Serve Pulse aggregated CSVs for front-end consumption
app.use(
  "/api/pulse/data",
  express.static(path.resolve(__dirname, "../pulse/aggregate"))
);
app.use(
  "/api/pulse/data",
  expressStatic.static(path.resolve(__dirname, '../pulse/aggregate'))
);
app.use("/api/chat", chatRouter);
app.use("/api/pulse", pulseRouter);
app.use("/dashboard", dashboardRouter);
app.use("/hr", hrRouter);
app.use("/billing", billingRouter);
app.use("/expenses", expensesRouter);

// Start server regardless of database initialization
app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});

// Initialize database connection (skip if SKIP_DB_INIT=true)
if (process.env.SKIP_DB_INIT === 'true') {
  console.log("SKIP_DB_INIT=true; skipping database initialization");
} else {
  AppDataSource.initialize()
    .then(() => console.log("Data Source has been initialized!"))
    .catch((error) => console.error("Error during Data Source initialization", error));
}