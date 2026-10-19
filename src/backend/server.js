import express from 'express';
import cors from 'cors';
import receptionRouter from './routes/receptionRoutes.js';
import { getDatabase } from './config/database.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("src/frontend"));
app.use("/public", express.static("public"));

app.get("/", (req, res) => {
  res.redirect("/pages/index.html");
});

app.use(receptionRouter);

const PORT = 3000;

app.post('/api/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    console.log("🔐 Tentativa de login:", username);

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nome de usuário e senha são obrigatórios.'
      });
    }

    const db = await getDatabase();

    const [rows] = await db.query(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    const user = rows[0];

    if (!user) {
      console.log("❌ Usuário não encontrado");

      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos.'
      });
    }

    if (password !== user.password) {
      console.log("❌ Senha incorreta");

      return res.status(401).json({
        success: false,
        message: 'Usuário ou senha inválidos.'
      });
    }

    console.log("✅ Login autorizado:", user.username);

    return res.status(200).json({
      success: true,
      message: 'Login bem-sucedido.',
      user: {
        id: user.id,
        username: user.username,
        nome: user.nome,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);

    return res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
});

getDatabase()
  .then(async (db) => {
    await db.query("SELECT 1");
    console.log("Conexão com o MySQL verificada com sucesso.");

    app.listen(PORT, () => {
      console.log(`Servidor rodando em http://localhost:${PORT}`);
    });
  })
  .catch(error => {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  });