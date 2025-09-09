import {z, ZodError} from 'zod'
import * as PacientService from '../services/pacientService.js'
import { Prisma  } from '@prisma/client'

const createSchma = z.object({
    nome: z.string().min(3, "mínimo 3 letras"),
    motivo: z.string(),
    prioridade: z.enum([   'URGENTE','MODERADO', 'LEVE']),
    status: z.enum(['AGUARDANDO' , 'EM_ATENDIMENTO', 'ATENDIDO']),
    
})

export const createPacient = async (req,res) => {
    try{
        const validateDAte = createSchma.parse(req.body)
        const paciente = await PacientService.createPaciente(validateDAte)
        res.status(201).json(paciente)
    }
    catch (error){
        if(error.name === 'ZodError'){
            return res.status(400).json( {error: error.message})
        }
        res.status(500).json({error: error.message})
    }
}

export const getPacient = async (req,res) => {
    try{
        const pacientes = await PacientService.getPaciente()
        res.json(pacientes)
    }
    catch(error){
        res.status(500).json({error: error.message})
    }
}

export const updatePaciente = async (req,res) => {
    try{
        const {id} = req.params
        const {status} = createSchma.parse(req.body)
        const paciente = await PacientService.patchPaciente(id, status )
        res.json({atualizado: paciente})
    } catch (error){
         if (error.errors) {
            return res.status(400).json({ errors: error.errors });
    }
            res.status(500).json({ error: error.message });
    }
}