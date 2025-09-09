import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function iniciarAtendimento(pacienteId, medicoId, horaInicio = new Date(), status = "EM_ATENDIMENTO") {
  // Atualiza o status do paciente
  await prisma.paciente.update({
    where: { id: pacienteId },
    data: { status },
  });

  // Cria o atendimento
  const atendimento = await prisma.atendimento.create({
    data: {
      pacienteId,
      medicoId,
      horaInicio,
      status,
    },
    include: {
      paciente: true,
      medico: true,
    },
  });

  return atendimento;
}


export async function finalizarAtendimento(atendimentoId) {
  try {
    // Buscar atendimento com informações do paciente
    const atendimento = await prisma.atendimento.findUnique({
      where: { id: atendimentoId },
      include: { paciente: true }
    });

    // Verificações iniciais
    if (!atendimento) {
      throw new Error('Atendimento não encontrado');
    }

    if (atendimento.status === 'ATENDIDO') {
      throw new Error('Atendimento já finalizado');
    }

    // Executar ambas as operações em uma transação
    const resultado = await prisma.$transaction(async (tx) => {
      // 1. Finalizar o atendimento
      const atendimentoFinalizado = await tx.atendimento.update({
        where: { id: atendimentoId },
        data: {
          status: 'ATENDIDO',
          horaFim: new Date()
        },
        include: {
          paciente: true,
          medico: true
        }
      });

      // 2. Atualizar status do paciente
      await tx.paciente.update({
        where: { id: atendimento.pacienteId },
        data: { status: 'ATENDIDO' }
      });

      return atendimentoFinalizado;
    });

    return resultado;
  } catch (error) {
    console.error('Erro ao finalizar atendimento:', error);
    
    // Melhorar mensagens de erro específicas
    if (error.code === 'P2025') {
      throw new Error('Registro não encontrado no banco de dados');
    }
    
    throw new Error(error.message || 'Não foi possível finalizar o atendimento');
  }
}

export async function historico(page = 1, pageSize = 10) {
  try {
    const skip = (page - 1) * pageSize;
    
    //paginação
    //promisseAll recebe varias promessas o atendimento se refere ao primeira Promisse entqual total a segunda promisse
    const [atendimentos, total] = await Promise.all([
      //atendimentos
      prisma.atendimento.findMany({
        where: {      OR: [
        { status: 'ATENDIDO' },
        { status: 'EM_ATENDIMENTO' }
      ]
 },
        include: { paciente: true, medico: true },
        orderBy: { horaFim: 'desc' },
        skip: skip,    
        take: pageSize 
      }),
      
      // total
      prisma.atendimento.count({
         where: {      OR: [
        { status: 'ATENDIDO' },
        { status: 'EM_ATENDIMENTO' }
      ]
 }})
    ]);

    return {
      atendimentos,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };

  } catch (error) {
    console.error('Erro ao buscar histórico:', error);
    throw new Error('Não foi possível carregar o histórico');
  }
}