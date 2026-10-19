import mysql from 'mysql2/promise';
import { loadEnvFile } from 'node:process';
import { fileURLToPath } from 'node:url';

try {
  loadEnvFile(fileURLToPath(new URL('../../../.env', import.meta.url)));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}

const required = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
const missing = required.filter(key => process.env[key] === undefined ||
  (key !== 'DB_PASSWORD' && process.env[key].trim() === ''));
if (missing.length) {
  throw new Error('Configure as variáveis de ambiente: ' + missing.join(', ') + '. Consulte .env.example.');
}

const port = Number(process.env.DB_PORT);
if (!Number.isInteger(port) || port < 1 || port > 65535) {
  throw new Error('DB_PORT deve ser um número inteiro entre 1 e 65535.');
}

const conexao = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default conexao;
