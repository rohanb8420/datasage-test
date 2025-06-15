import { Router } from "express";
import OpenAI from "openai";
import fs from "fs";
import path from "path";
import Papa from "papaparse";

const router = Router();

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
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// POST /api/pulse
router.post("/", async (req, res) => {
  console.log('[Pulse] Received messages:', req.body.messages);
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

    // Enumerate raw data files for Pulse (monthly series)
    const rawDir = path.resolve(__dirname, "../../../../webapp/public/data/pulse/raw-data");
    const dataDir = rawDir;
    let files: string[] = [];
    try {
      files = fs.readdirSync(dataDir).filter(f => f.endsWith('.csv'));
    } catch {
      files = [];
    }
    // Build detailed file list (filename, columns, sample row)
    const fileInfos: string[] = [];
    for (const f of files) {
      try {
        const raw = fs.readFileSync(path.join(dataDir, f), 'utf8');
        const parsed = Papa.parse(raw, { header: true, preview: 1 });
        const cols = parsed.meta.fields || [];
        const sample = (parsed.data as any[])[0] || {};
        fileInfos.push(`- ${f}: columns [${cols.join(', ')}]; sample ${JSON.stringify(sample)}`);
      } catch {
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
    // Use environment override OPENAI_API_MODEL or fallback to GPT-4o
    const model = process.env.OPENAI_API_MODEL || "gpt-4o";
    const completion = await openai.chat.completions.create({
      // Always use GPT-4o
      model: "gpt-4o",
      messages: chatMessages,
      functions: [
        {
          name: "create_chart",
          description: "Aggregate CSV data and write aggregated CSV under public/data/pulse/aggregate",
          parameters: {
            type: "object",
            properties: {
              chartType: { type: "string", description: "Plotly type for primary series" },
              chartType2: { type: "string", description: "Plotly type for secondary series (optional)" },
              dataFile: { type: "string", description: "Source CSV filename relative to /data" },
              xField: { type: "string", description: "Column name for X-axis" },
              yField: { type: "string", description: "Column name for primary Y-axis" },
              yField2: { type: "string", description: "Column name for secondary Y-axis (optional)" },
              secondaryYAxis: { type: "boolean", description: "Plot second series on secondary y-axis", default: false },
              title: { type: "string", description: "Chart title (optional)" }
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

    const msg = completion.choices?.[0]?.message;
    if (msg?.function_call) {
      const functionName = msg.function_call.name;
      const args = JSON.parse(msg.function_call.arguments || "{}");
      // Handle data aggregation
      if (functionName === "create_chart") {
      const { chartType, chartType2, dataFile, xField, yField, yField2, secondaryYAxis = false, title } = args;
        const rawFilePath = path.join(dataDir, dataFile);
      let aggregatedCsv = "";
      try {
        const rawContent = fs.readFileSync(rawFilePath, "utf8");
        const parsed = Papa.parse(rawContent, {
          header: true,
          dynamicTyping: true,
          skipEmptyLines: true
        });
        const rows = parsed.data as Record<string, any>[];
        const aggMap: Record<string, { sum1: number; sum2?: number }> = {};
        rows.forEach(row => {
          const xVal = row[xField];
          const y1 = Number(row[yField]);
          if (xVal == null || isNaN(y1)) return;
          if (!aggMap[xVal]) aggMap[xVal] = { sum1: 0, sum2: 0 };
          aggMap[xVal].sum1 += y1;
          if (yField2) {
            const y2 = Number(row[yField2]);
            if (!isNaN(y2)) aggMap[xVal].sum2! += y2;
          }
        });
        const aggregated = Object.entries(aggMap).map(([key, sums]) => {
          const obj: any = { [xField]: key, [yField]: sums.sum1 };
          if (yField2) obj[yField2] = sums.sum2;
          return obj;
        });
        aggregatedCsv = Papa.unparse(aggregated);
      } catch (err) {
        console.error("Aggregation error:", err);
        aggregatedCsv = "";
      }
        // Write aggregated CSV to API folder to prevent CRA reload
        const aggDir = path.resolve(__dirname, "../pulse/aggregate");
        fs.mkdirSync(aggDir, { recursive: true });
        const outputName = dataFile;
        const outputPath = path.join(aggDir, outputName);
        fs.writeFileSync(outputPath, aggregatedCsv, "utf8");
      const returnedArgs: any = {
        chartType,
        // Instruct front-end to load from the aggregate folder
        dataFile: `pulse/aggregate/${outputName}`,
        xField,
        yField,
        title
      };
      if (chartType2) returnedArgs.chartType2 = chartType2;
      if (yField2) returnedArgs.yField2 = yField2;
      if (secondaryYAxis) returnedArgs.secondaryYAxis = secondaryYAxis;
        // Return function call: dataFile is the bare filename
        return res.json({ name: functionName, arguments: { ...returnedArgs, dataFile: outputName } });
      }
      // Handle component generation
      if (functionName === "create_component") {
        const { relativePath, code } = args;
        // Resolve to project webapp/src base
        const projectRoot = path.resolve(__dirname, "../../../../webapp");
        const outputPath = path.join(projectRoot, relativePath);
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, code, "utf8");
        return res.json({ name: functionName, arguments: args });
      }
    }
    // Fallback: return assistant text
    return res.json({ reply: msg?.content });
  } catch (error: any) {
    console.error('Pulse error:', error);
    return res.status(500).json({ error: error.message || 'Internal error' });
  }
});

export default router;