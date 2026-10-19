import { ReceptionModel } from '../models/receptionModel.js';
import { readGraphData, saveGraphData } from '../modules/storage.js';

function validateCPFBackend(cpf) {
  if (!cpf) return false;
  const cleanCpf = cpf.replace(/\D/g, '');

  if (cleanCpf.length !== 11 || /^(\d)\1+$/.test(cleanCpf)) return false;

  let soma = 0;
  for (let i = 0; i < 9; i++) soma += parseInt(cleanCpf[i]) * (10 - i);

  let resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;
  if (resto !== parseInt(cleanCpf[9])) return false;

  soma = 0;
  for (let i = 0; i < 10; i++) soma += parseInt(cleanCpf[i]) * (11 - i);

  resto = (soma * 10) % 11;
  if (resto === 10) resto = 0;

  return resto === parseInt(cleanCpf[10]);
}

async function syncGraphData() {
  try {
    const allVisits = await ReceptionModel.getAll();
    const anonymousData = allVisits.map(visit => ({
      dia: visit.dia,
      setor: visit.setor,
      avaliacao:
        visit.avaliacao === null ||
        visit.avaliacao === undefined ||
        visit.avaliacao === ''
            ? null
            : parseInt(visit.avaliacao)
    }));
    saveGraphData(anonymousData);
  } catch (err) {
    console.error('Error synchronizing graph data:', err);
  }
}

export class ReceptionController {
  static async getAllVisits(req, res) {
    try {
      const visits = await ReceptionModel.getAll();
      res.json(visits);
    } catch (error) {
      console.error('Error fetching visits:', error);
      res.status(500).json({ error: 'Erro ao buscar os registros de recepção.' });
    }
  }

  static async getVisitById(req, res) {
    try {
      const { id } = req.params;
      const visit = await ReceptionModel.getById(id);
      if (!visit) {
        return res.status(404).json({ error: 'Visita não encontrada.' });
      }
      res.json(visit);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  static async createVisit(req, res) {
    try {
      const data = req.body;
      
      // Real-time server-side validation - CPF is no longer mandatory
      if (!data.dia || !data.nome || !data.setor) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes (Data, Nome, Setor).' });
      }

      // Validate CPF if provided
      if (data.cpf && data.cpf.trim() !== '') {
        if (!validateCPFBackend(data.cpf)) {
          return res.status(400).json({ error: 'O CPF informado é inválido.' });
        }
      }

      const newVisit = await ReceptionModel.create(data);

      // Recalculate and synchronize anonymous statistics dynamically
      await syncGraphData();

      res.status(201).json({
        message: 'Registro cadastrado com sucesso',
        visit: newVisit
      });
    } catch (error) {
      console.error('Error creating visit:', error);
      res.status(500).json({ error: 'Erro ao cadastrar o registro de recepção.' });
    }
  }

  static async updateVisit(req, res) {
    try {
      const { id } = req.params;
      const data = req.body;

      // CPF is no longer mandatory
      if (!data.dia || !data.nome || !data.setor) {
        return res.status(400).json({ error: 'Campos obrigatórios ausentes (Data, Nome, Setor).' });
      }

      // Validate CPF if provided
      if (data.cpf && data.cpf.trim() !== '') {
        if (!validateCPFBackend(data.cpf)) {
          return res.status(400).json({ error: 'O CPF informado é inválido.' });
        }
      }

      const updatedVisit = await ReceptionModel.update(id, data);

      // Recalculate and synchronize anonymous statistics dynamically
      await syncGraphData();

      res.json({
        message: 'Registro atualizado com sucesso',
        visit: updatedVisit
      });
    } catch (error) {
      console.error('Error updating visit:', error);
      res.status(500).json({ error: 'Erro ao atualizar o registro.' });
    }
  }

  static async deleteVisit(req, res) {
    try {
      const { id } = req.params;
      const success = await ReceptionModel.delete(id);
      
      if (!success) {
        return res.status(404).json({ error: 'Registro não encontrado.' });
      }

      // Recalculate and synchronize anonymous statistics dynamically
      await syncGraphData();

      res.json({ message: 'Registro excluído com sucesso' });
    } catch (error) {
      console.error('Error deleting visit:', error);
      res.status(500).json({ error: 'Erro ao excluir o registro.' });
    }
  }

  static async getStatistics(req, res) {
    try {
      const allVisits = await ReceptionModel.getAll();
      const graphData = allVisits.map(visit => ({
        dia: visit.dia,
        setor: visit.setor,
        avaliacao:
          visit.avaliacao === null ||
          visit.avaliacao === undefined ||
          visit.avaliacao === ''
            ? null
            : parseInt(visit.avaliacao)
      }));
      saveGraphData(graphData);
      res.json(graphData);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      res.status(500).json({ error: 'Erro ao processar estatísticas.' });
    }
  }
}
