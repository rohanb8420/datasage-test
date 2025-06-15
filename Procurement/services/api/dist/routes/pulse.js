"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const openai_1 = __importDefault(require("openai"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const papaparse_1 = __importDefault(require("papaparse"));
const router = (0, express_1.Router)();
// System prompt for the Pulse assistant
const systemPrompt = `
You are Pulse, a procurement data analyst and code generator.
When a user asks for a report or chart, you will be provided a list of available CSV files, their column schemas, and sample rows.
First, determine which CSV file best matches the requested fields by referring to the provided list.
Then call the create_chart function with the following parameters:
  chartType: Plotly chart type (e.g., "bar", "line", "scatter").
  dataFile: the filename of the chosen CSV relative to /data.
  xField and yField: the column names for axes.
  title: (optional) a descriptive title for the chart.
If the user also wants a new dashboard component, call the create_component function with:
  componentName: the React component name.
  relativePath: path under webapp/src (e.g., "src/components/pulse/MyTile.tsx").
  code: full TypeScript React component source (imports, component, fetch for /data/pulse/..., Plotly, Tailwind CSS styling).
Always use function calls (JSON) only; do not emit any explanation outside of a function_call response.
`;
// Initialize OpenAI client
const openai = new openai_1.default({ apiKey: process.env.OPENAI_API_KEY });
// POST /api/pulse
router.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    try {
        const { messages } = req.body;
        if (!Array.isArray(messages)) {
            return res.status(400).json({ error: "Invalid messages payload" });
        }
        // Quick fallback for "top suppliers by spend" request
        const userMsg = messages.filter(m => m.role === 'user').map(m => m.content).join(' ').toLowerCase();
        if (userMsg.includes('top suppliers') && userMsg.includes('by spend')) {
            // Use existing CSV directly
            return res.json({
                name: 'create_chart',
                arguments: {
                    chartType: 'bar',
                    dataFile: 'top_suppliers_by_spend.csv',
                    xField: 'supplier',
                    yField: 'spend',
                    title: 'Top Suppliers by Spend'
                }
            });
        }
        // Enumerate CSV files with their columns and a sample row
        const dataDir = path_1.default.resolve(__dirname, "../../../../webapp/public/data");
        let files = [];
        try {
            files = fs_1.default.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
        }
        catch (_c) {
            files = [];
        }
        // Build detailed file list (filename, columns, sample row)
        const fileInfos = [];
        for (const f of files) {
            try {
                const raw = fs_1.default.readFileSync(path_1.default.join(dataDir, f), 'utf8');
                const parsed = papaparse_1.default.parse(raw, { header: true, preview: 1 });
                const cols = parsed.meta.fields || [];
                const sample = parsed.data[0] || {};
                fileInfos.push(`- ${f}: columns [${cols.join(', ')}]; sample ${JSON.stringify(sample)}`);
            }
            catch (_d) {
                fileInfos.push(`- ${f}`);
            }
        }
        const dataList = fileInfos.join("\n");
        // Merge instructions and file schema into a single system message
        const initialPrompt = `${systemPrompt}\nAvailable data files and their columns:\n${dataList}`;
        const chatMessages = [
            { role: 'system', content: initialPrompt },
            ...messages
        ];
        // Request with function support
        // Use environment override OPENAI_API_MODEL or fallback to a function-capable model
        const model = process.env.OPENAI_API_MODEL || "gpt-3.5-turbo-0613";
        const completion = yield openai.chat.completions.create({
            model,
            messages: chatMessages,
            functions: [
                {
                    name: "create_chart",
                    description: "Aggregate CSV data and write aggregated CSV under public/data/pulse",
                    parameters: {
                        type: "object",
                        properties: {
                            chartType: { type: "string" },
                            dataFile: { type: "string" },
                            xField: { type: "string" },
                            yField: { type: "string" },
                            title: { type: "string" }
                        },
                        required: ["chartType", "dataFile", "xField", "yField"]
                    }
                },
                {
                    name: "create_component",
                    description: "Generate a React component file for a new dashboard tile",
                    parameters: {
                        type: "object",
                        properties: {
                            componentName: { type: "string" },
                            relativePath: { type: "string", description: "Path under webapp/src, e.g., 'src/components/pulse/MyTile.tsx'" },
                            code: { type: "string", description: "Full file content including imports and component definition" }
                        },
                        required: ["componentName", "relativePath", "code"]
                    }
                }
            ],
            function_call: "auto"
        });
        const msg = (_b = (_a = completion.choices) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.message;
        if (msg === null || msg === void 0 ? void 0 : msg.function_call) {
            const functionName = msg.function_call.name;
            const args = JSON.parse(msg.function_call.arguments || "{}");
            // Handle data aggregation
            if (functionName === "create_chart") {
                const { chartType, dataFile, xField, yField, title } = args;
                const rawFilePath = path_1.default.join(dataDir, dataFile);
                let aggregatedCsv = "";
                try {
                    const rawContent = fs_1.default.readFileSync(rawFilePath, "utf8");
                    const parsed = papaparse_1.default.parse(rawContent, {
                        header: true,
                        dynamicTyping: true,
                        skipEmptyLines: true
                    });
                    const rows = parsed.data;
                    const aggMap = {};
                    rows.forEach(row => {
                        const xVal = row[xField];
                        const yVal = Number(row[yField]);
                        if (xVal == null || isNaN(yVal))
                            return;
                        aggMap[xVal] = (aggMap[xVal] || 0) + yVal;
                    });
                    const aggregated = Object.entries(aggMap).map(([key, sum]) => ({
                        [xField]: key,
                        [yField]: sum
                    }));
                    aggregatedCsv = papaparse_1.default.unparse(aggregated);
                }
                catch (err) {
                    console.error("Aggregation error:", err);
                    aggregatedCsv = "";
                }
                const pulseDir = path_1.default.join(dataDir, "pulse");
                fs_1.default.mkdirSync(pulseDir, { recursive: true });
                const outputName = dataFile;
                const outputPath = path_1.default.join(pulseDir, outputName);
                fs_1.default.writeFileSync(outputPath, aggregatedCsv, "utf8");
                const returnedArgs = {
                    chartType,
                    dataFile: `pulse/${outputName}`,
                    xField,
                    yField,
                    title
                };
                return res.json({ name: functionName, arguments: returnedArgs });
            }
            // Handle component generation
            if (functionName === "create_component") {
                const { relativePath, code } = args;
                // Resolve to project webapp/src base
                const projectRoot = path_1.default.resolve(__dirname, "../../../../webapp");
                const outputPath = path_1.default.join(projectRoot, relativePath);
                fs_1.default.mkdirSync(path_1.default.dirname(outputPath), { recursive: true });
                fs_1.default.writeFileSync(outputPath, code, "utf8");
                return res.json({ name: functionName, arguments: args });
            }
        }
        // Fallback: return assistant text
        return res.json({ reply: msg === null || msg === void 0 ? void 0 : msg.content });
    }
    catch (error) {
        console.error('Pulse error:', error);
        return res.status(500).json({ error: error.message || 'Internal error' });
    }
}));
exports.default = router;
