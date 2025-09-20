// routes/paciente.js - CORRIGIDO
import express from 'express'
import { createPacient, getPacient, updatePaciente, getPacientesAguardandoTriagem } from '../controllers/pacienteController.js'


const router = express.Router()

router.post('/', createPacient)
router.get('/', getPacient)
router.get('/aguardando-triagem', getPacientesAguardandoTriagem )
router.patch('/:id', updatePaciente) // ← CORRETO: /paciente/:id

export default router