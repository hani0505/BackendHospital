import express from 'express'
import { iniciarAtendimento, finalizarAtendimento , historico} from '../controllers/atendimentoController.js'
import { authMedico } from '../middlewares/authMiddllewares.js'


const router = express.Router()

router.post('/iniciar' ,iniciarAtendimento)
router.post('/finalizar/:id', authMedico ,finalizarAtendimento)
router.get('/historico' ,historico)

export default router