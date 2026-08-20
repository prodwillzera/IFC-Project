import express from 'express';
import cors from 'cors';
import receptionRouter from './routes/receptionRoutes.js';
import { getDatabase } from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("src/frontend"));
  
app.get("/", (req, res) => {
  res.redirect("/pages/index.html");
});

app.use(receptionRouter);

const PORT = 3000;
getDatabase().then(() => {
  console.log("Database initialized successfully.");
  app.listen(3000, () => {
    console.log("Servidor rodando em http://localhost:3000");
  });
}).catch(err => {
  console.error("Failed to initialize database:", err);
  process.exit(1);
});
