import { PrismaClient } from "@prisma/client";
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

export const createDoctor = async (data) => {
  const hashedPassword = await bcrypt.hash(data.senha, 10);

  return await prisma.medico.create({
    data: {
      nome: data.nome,
      especialidade: data.especialidade,
      email: data.email,
      senha: data.senha,
    },
  });
};

export const getDoctors = async () => {
  return await prisma.medico.findMany({
    select: {
      id: true,
      nome: true,
      especialidade: true,
      email: true,
    }, // não retorna a senha
  });
};