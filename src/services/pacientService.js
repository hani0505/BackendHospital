import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'
import { id } from "zod/locales";

const prisma = new PrismaClient()

export const createPaciente = async(data) => {
    // const hashPassword = await bcrypt.hash(data.senha, 10)

    return await prisma.paciente.create({
        data: {
            nome: data.nome,
            motivo: data.motivo,
            prioridade: data.prioridade,
            status: data.status
        }
    })
}

export async function getPaciente() {
    return await prisma.paciente.findMany({
        select: {
            id: true,
            nome: true,
            motivo: true,
            prioridade: true,
            status: true
        }
    })
}

export const patchPaciente = async (id, data) => {
    try {
        return await prisma.paciente.update({
            where: { id },
            data: data
        });
    } catch (error) {
        throw new Error(`Erro ao atualizar paciente: ${error.message}`);
    }
}
// Retorna apenas pacientes com status AGUARDANDO_TRIAGEM
export async function obterPacientesAguardandoTriagem() {
  const pacientes = await prisma.paciente.findMany({
    where: {
      status: "AGUARDANDO_TRIAGEM"
    },
    orderBy: {
      dataCadastro: "asc"
    }
  });
  return pacientes;
}
