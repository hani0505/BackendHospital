import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function iniciarAtendimento(pacienteId, medicoId, horaInicio = new Date(), status = "EM_ATENDIMENTO") {
  try {
    const paciente = await prisma.paciente.findUnique({ where: { id: pacienteId } });
    if (!paciente) throw new Error("Paciente não encontrado");

    const medico = await prisma.medico.findUnique({ where: { id: medicoId } });
    if (!medico) throw new Error("Médico não encontrado");

    await prisma.paciente.update({ where: { id: pacienteId }, data: { status: 'EM_ATENDIMENTO' } });

    const atendimento = await prisma.atendimento.create({
      data: { pacienteId, medicoId, horaInicio, status },
      include: { paciente: true, medico: true },
    });

    return atendimento;
  } catch (error) {
    console.error("ERRO no iniciarAtendimento:", error.message);
    throw new Error(error.message || "Erro ao iniciar atendimento");
  }
}

// services/atendimentoService.js - NOVA função finalizarAtendimento
// services/atendimentoService.js
export async function finalizarAtendimento(pacienteId, horaFim = new Date(), status = "ATENDIDO") {
  try {
    console.log("Buscando atendimento ativo para paciente:", pacienteId);
    
    if (!pacienteId) {
      throw new Error("ID do paciente não fornecido");
    }

    // Busca o atendimento ATIVO do paciente
    const atendimento = await prisma.atendimento.findFirst({
      where: { 
        pacienteId: pacienteId,
        status: "EM_ATENDIMENTO",
        horaFim: null
      }
    });

    if (!atendimento) {
      throw new Error(`Nenhum atendimento ativo encontrado para o paciente ${pacienteId}`);
    }

    console.log("Atendimento encontrado:", atendimento.id);

    // Atualiza atendimento
    const finalizado = await prisma.atendimento.update({
      where: { id: atendimento.id },
      data: { horaFim, status },
      include: { paciente: true, medico: true },
    });

    // Atualiza status do paciente - CORRIGIDO
    await prisma.paciente.update({
      where: { id: pacienteId }, // Usa o pacienteId recebido
      data: { status: "ATENDIDO" }
    });

    console.log("Atendimento finalizado com sucesso!");
    return finalizado;
  } catch (error) {
    console.error("ERRO no finalizarAtendimento:", error.message);
    throw new Error(error.message || "Erro ao finalizar atendimento");
  }
}

export async function historico(page = 1, pageSize = 10) {
  const skip = (page - 1) * pageSize;
  const total = await prisma.atendimento.count();
  const atendimentos = await prisma.atendimento.findMany({
    skip,
    take: pageSize,
    orderBy: { horaInicio: "desc" },
    include: { paciente: true, medico: true },
  });

  return {
    atendimentos,
    page,
    pageSize,
    total,
    totalPages: Math.ceil(total / pageSize),
  };
}
