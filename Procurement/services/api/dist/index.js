"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const data_source_1 = require("./data-source");
const dashboard_1 = __importDefault(require("./routes/dashboard"));
const hr_1 = __importDefault(require("./routes/hr"));
const billing_1 = __importDefault(require("./routes/billing"));
const expenses_1 = __importDefault(require("./routes/expenses"));
const chat_1 = __importDefault(require("./routes/chat"));
const pulse_1 = __importDefault(require("./routes/pulse"));
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Configure middleware and routes
app.use(express_1.default.json());
app.use("/api/chat", chat_1.default);
app.use("/api/pulse", pulse_1.default);
app.use("/dashboard", dashboard_1.default);
app.use("/hr", hr_1.default);
app.use("/billing", billing_1.default);
app.use("/expenses", expenses_1.default);
// Start server regardless of database initialization
app.listen(port, () => {
    console.log(`API server running at http://localhost:${port}`);
});
// Initialize database connection (skip if SKIP_DB_INIT=true)
if (process.env.SKIP_DB_INIT === 'true') {
    console.log("SKIP_DB_INIT=true; skipping database initialization");
}
else {
    data_source_1.AppDataSource.initialize()
        .then(() => console.log("Data Source has been initialized!"))
        .catch((error) => console.error("Error during Data Source initialization", error));
}
