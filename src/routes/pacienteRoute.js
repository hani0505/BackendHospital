import express from 'express'
import { createPacient , getPacient, updatePaciente } from '../controllers/pacienteController.js'

const router = express.Router()

router.post('/', createPacient)
router.get('/', getPacient)
router.patch('/:id/status', updatePaciente)
router.post('/:id/triagem', (req, res) => {
    try {
        const { id } = req.params;
        // Implementação simples para salvar dados de triagem
        res.status(200).json({ message: 'Dados de triagem salvos com sucesso', pacienteId: id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
})

export default router