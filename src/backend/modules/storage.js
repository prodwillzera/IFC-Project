import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const graphPath = path.join(
  __dirname,
  "..",
  "..",
  "..",
  "data",
  "data.json"
);

function readGraphData() {
  if (!fs.existsSync(graphPath)) return [];
  try {
    const content = fs.readFileSync(graphPath, "utf8");
    return content ? JSON.parse(content) : [];
  } catch (err) {
    console.error("Error reading graph data:", err);
    return [];
  }
}

function saveGraphData(data) {
  try {
    const dataDir = path.dirname(graphPath);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(graphPath, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.error("Error saving graph data:", err);
  }
}

// Deprecated stubs to avoid any broken imports
function readReceptionData() {
  return [];
}

function saveReceptionData(data) {
  // No-op
}

export {
  readReceptionData,
  saveReceptionData,
  readGraphData,
  saveGraphData
};
