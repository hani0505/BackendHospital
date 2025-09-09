import express from 'express'
import { createPacient , getPacient, updatePaciente } from '../controllers/pacienteController.js'

const router = express.Router()

router.post('/', createPacient)
router.get('/', getPacient)
router.patch('/:id/status', updatePaciente )

export default router