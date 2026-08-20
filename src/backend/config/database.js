import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbFile = path.resolve(__dirname, '../../../data/database.sqlite');
const jsonDbPath = path.resolve(__dirname, '../../../data/database.json');
const legacyJsonPath = path.resolve(__dirname, '../../../data/dataReception.json');

let dbInstance = null;

export async function getDatabase() {
  if (dbInstance) return dbInstance;

  const dataDir = path.dirname(dbFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  console.log(`Initializing SQLite database at: ${dbFile}`);

  // Open the real SQLite database
  dbInstance = await open({
    filename: dbFile,
    driver: sqlite3.Database
  });

  // Create the tables with structured columns following database best practices
  await dbInstance.exec(`
    CREATE TABLE IF NOT EXISTS receptions (
      id TEXT PRIMARY KEY,
      dia TEXT NOT NULL,
      nome TEXT NOT NULL,
      cpf TEXT,
      motivo TEXT NOT NULL,
      setor TEXT NOT NULL,
      entrada TEXT,
      saida TEXT,
      avaliacao INTEGER DEFAULT 5,
      telefone TEXT,
      empresa TEXT,
      responsavel TEXT,
      observacoes TEXT,
      documento TEXT,
      status TEXT DEFAULT 'Concluído',
      created_at TEXT NOT NULL
    )
  `);

  // Check if we need to migrate legacy JSON data to the SQLite database
  const countResult = await dbInstance.get('SELECT COUNT(*) as count FROM receptions');
  if (countResult.count === 0) {
    let sourceRecords = [];

    // Prioritize migrating from database.json (which was the live JSON db)
    if (fs.existsSync(jsonDbPath)) {
      try {
        const content = fs.readFileSync(jsonDbPath, 'utf8');
        sourceRecords = content ? JSON.parse(content) : [];
        console.log(`Found ${sourceRecords.length} records in database.json to migrate.`);
      } catch (err) {
        console.error('Error reading database.json for migration:', err);
      }
    }

    // Fallback to legacyJsonPath if database.json was empty or didn't exist
    if (sourceRecords.length === 0 && fs.existsSync(legacyJsonPath)) {
      try {
        const content = fs.readFileSync(legacyJsonPath, 'utf8');
        sourceRecords = content ? JSON.parse(content) : [];
        console.log(`Found ${sourceRecords.length} records in dataReception.json to migrate.`);
      } catch (err) {
        console.error('Error reading dataReception.json for migration:', err);
      }
    }

    if (sourceRecords.length > 0) {
      console.log(`Migrating ${sourceRecords.length} records into SQLite database...`);
      const insertStmt = await dbInstance.prepare(`
        INSERT INTO receptions (
          id, dia, nome, cpf, motivo, setor, entrada, saida, avaliacao,
          telefone, empresa, responsavel, observacoes, documento, status, created_at
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const r of sourceRecords) {
        await insertStmt.run([
          r.id || `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          r.dia || '',
          r.nome || '',
          r.cpf || '',
          r.motivo || '',
          r.setor || '',
          r.entrada || '',
          r.saida || '',
          parseInt(r.avaliacao) || 5,
          r.telefone || '',
          r.empresa || '',
          r.responsavel || '',
          r.observacoes || '',
          r.documento || '',
          r.status || 'Concluído',
          r.created_at || new Date().toISOString()
        ]);
      }
      await insertStmt.finalize();
      console.log('Migration to SQLite completed successfully!');
    }
  }

  // To secure sensitive visitor data, remove the sensitive JSON files if migration is complete and SQLite contains records
  try {
    const finalCount = await dbInstance.get('SELECT COUNT(*) as count FROM receptions');
    if (finalCount.count > 0) {
      if (fs.existsSync(jsonDbPath)) {
        fs.unlinkSync(jsonDbPath);
        console.log('Deleted sensitive database.json file.');
      }
      if (fs.existsSync(legacyJsonPath)) {
        fs.unlinkSync(legacyJsonPath);
        console.log('Deleted sensitive dataReception.json file.');
      }
    }
  } catch (err) {
    console.error('Error while cleaning up sensitive JSON files:', err);
  }

  return dbInstance;
}
