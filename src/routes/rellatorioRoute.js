// routes/relatorioRouter.js
import express from 'express';
import { estatisticas, downloadRelatorio } from '../controllers/relatorioController.js';

const router = express.Router();

router.get('/', estatisticas);
router.get('/download', downloadRelatorio);

export default router;
