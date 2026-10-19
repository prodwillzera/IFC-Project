import { getDatabase } from '../config/database.js';

export class ReceptionModel {

  static async getAll() {
    const db = await getDatabase();

    const [rows] = await db.query(
      'SELECT * FROM receptions ORDER BY created_at DESC'
    );

    return rows;
  }

  static async getById(id) {
    const db = await getDatabase();

    const [rows] = await db.query(
      'SELECT * FROM receptions WHERE id = ?',
      [id]
    );

    return rows[0] || null;
  }

  static async create(data) {
    const db = await getDatabase();

    const id = data.id ||
      `rec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    await db.query(
      `INSERT INTO receptions (
        id, dia, nome, cpf, motivo, setor, entrada, saida, avaliacao,
        telefone, empresa, responsavel, observacoes, documento, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.dia || '',
        data.nome || '',
        data.cpf || '',
        data.motivo || '',
        data.setor || '',
        data.entrada || '',
        data.saida || '',
        data.avaliacao === null ||
        data.avaliacao === undefined ||
        data.avaliacao === ''
            ? null
            : parseInt(data.avaliacao),
        data.telefone || '',
        data.empresa || '',
        data.responsavel || '',
        data.observacoes || '',
        data.documento || '',
        data.status || 'Concluído',
        data.created_at || new Date().toISOString()
      ]
    );

    return await this.getById(id);
  }

  static async update(id, data) {
    const db = await getDatabase();

    await db.query(
      `UPDATE receptions SET
        dia = ?, nome = ?, cpf = ?, motivo = ?, setor = ?,
        entrada = ?, saida = ?, avaliacao = ?, telefone = ?,
        empresa = ?, responsavel = ?, observacoes = ?,
        documento = ?, status = ?
      WHERE id = ?`,
      [
        data.dia,
        data.nome,
        data.cpf,
        data.motivo,
        data.setor,
        data.entrada,
        data.saida,
        data.avaliacao === null ||
        data.avaliacao === undefined ||
        data.avaliacao === ''
            ? null
            : parseInt(data.avaliacao),
        data.telefone || '',
        data.empresa || '',
        data.responsavel || '',
        data.observacoes || '',
        data.documento || '',
        data.status || 'Concluído',
        id
      ]
    );

    return await this.getById(id);
  }

  static async delete(id) {
    const db = await getDatabase();

    const record = await this.getById(id);

    if (!record) {
      return false;
    }

    await db.query(
      'DELETE FROM receptions WHERE id = ?',
      [id]
    );

    return true;
  }
}