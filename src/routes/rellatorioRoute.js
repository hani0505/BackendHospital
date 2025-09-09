import express from 'express'
import { estatisticas } from '../controllers/relatorioController.js';
const router = express.Router()

router.get('/', estatisticas);

export default router