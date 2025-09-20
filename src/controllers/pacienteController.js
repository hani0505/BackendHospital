// controllers/pacienteController.js
import { z, ZodError } from 'zod'
import * as PacientService from '../services/pacientService.js'
import { PrismaClient, Prisma } from '@prisma/client'
const prisma = new PrismaClient()

const createSchema = z.object({
  nome: z.string().min(3),
  motivo: z.string(),
  prioridade: z.enum(['EMERGÊNCIA','MUITO_URGENTE','URGENTE','POUCO_URGENTE','NÃO_URGENTE']),
  status: z.enum(['AGUARDANDO','AGUARDANDO_TRIAGEM','AGUARDANDO_MEDICO','EM_ATENDIMENTO','ATENDIDO']),
})

export const createPacient = async (req,res) => {
  try {
    const validatedData = createSchema.parse(req.body)
    const paciente = await PacientService.createPaciente(validatedData)
    res.status(201).json(paciente)
  } catch(error) {
    if(error instanceof ZodError){
      return res.status(400).json({ error: error.errors })
    }
    res.status(500).json({ error: error.message })
  }
}

export const getPacient = async (req,res) => {
  try{
    const pacientes = await PacientService.getPaciente()
    res.json(pacientes)
  } catch(error) {
    res.status(500).json({ error: error.message })
  }
}

export const updatePaciente = async (req,res) => {
  try {
    const { id } = req.params
    const updateSchema = z.object({
      status: z.enum(['AGUARDANDO','AGUARDANDO_TRIAGEM','AGUARDANDO_MEDICO','EM_ATENDIMENTO','ATENDIDO']).optional(),
      prioridade: z.enum(['EMERGÊNCIA','MUITO_URGENTE','URGENTE','POUCO_URGENTE','NÃO_URGENTE']).optional(),
      queixaPrincipal: z.string().optional(),
      observacoesTriagem: z.string().optional(),
      corTriagem: z.string().optional()
    })

    const validatedData = updateSchema.parse(req.body)

    if (Object.keys(validatedData).length === 0) {
      return res.status(400).json({ error: "Nenhum campo fornecido para atualização" })
    }

    const paciente = await PacientService.patchPaciente(id, validatedData)
    res.json(paciente)
  } catch(error) {
    if(error instanceof ZodError) {
      return res.status(400).json({ errors: error.errors })
    }
    if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
      return res.status(404).json({ error: "Paciente não encontrado" })
    }
    console.error(error)
    res.status(500).json({ error: "Erro interno do servidor" })
  }
}
export const getPacientesAguardandoTriagem = async (req, res) => {
  try {
    const pacientes = await prisma.paciente.findMany({
      where: { status: "AGUARDANDO_TRIAGEM" },
      orderBy: { dataCadastro: "asc" }
    });
    res.json(pacientes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
