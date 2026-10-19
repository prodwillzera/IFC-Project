import conexao from './connection.js';

export async function getDatabase() {
  return conexao;
}