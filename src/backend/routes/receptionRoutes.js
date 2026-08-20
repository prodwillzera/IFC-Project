import express from 'express';
import { ReceptionController } from '../controllers/receptionController.js';

const router = express.Router();

// Fetch all visits
router.get('/visitas', ReceptionController.getAllVisits);

// Fetch a single visit
router.get('/visitas/:id', ReceptionController.getVisitById);

// Create a new visit (replaces custom "/salvar" endpoint logic but keeps backward compatibility)
router.post('/salvar', ReceptionController.createVisit);
router.post('/visitas', ReceptionController.createVisit);

// Update a visit
router.put('/visitas/:id', ReceptionController.updateVisit);

// Delete a visit
delete router.delete; // Avoid reserved word conflict issues, or use direct assignment
router.delete('/visitas/:id', ReceptionController.deleteVisit);

// Fetch chart data
router.get('/grafico', ReceptionController.getStatistics);

export default router;
