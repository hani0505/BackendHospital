import express from 'express'
import { iniciarAtendimento, finalizarAtendimento , historico} from '../controllers/atendimentoController.js'

const router = express.Router()

router.post('/iniciar', iniciarAtendimento)
router.post('/finalizar/:id', finalizarAtendimento)
router.get('/historico', historico)

export default router