import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function gerarEstatisticas() {
  try {
    console.log('Gerando estatísticas...');

    // 1. Quantidade de pacientes atendidos por médico
    const pacientesPorMedico = await prisma.medico.findMany({
      select: {
        id: true,
        nome: true,
        especialidade: true,
        _count: {
          select: {
            atendimento: {
              where: {
                status: 'ATENDIDO'
              }
            }
          }
        }
      }
    });

    // 2. Buscar atendimentos finalizados para calcular tempos - CORRIGIDO
    const atendimentosFinalizados = await prisma.atendimento.findMany({
      where: {
        status: 'ATENDIDO',
        horaInicio: { not: undefined }, // Correção para versão 6.15.0
        horaFim: { not: undefined },    // Correção para versão 6.15.0
        paciente: {
          dataCadastro: { not: undefined } // Correção para versão 6.15.0
        }
      },
      include: {
        paciente: {
          select: {
            dataCadastro: true
          }
        },
        medico: {
          select: {
            nome: true,
            especialidade: true
          }
        }
      }
    });

    // 3. Calcular tempos médios
    let totalTempoEspera = 0;
    let totalTempoAtendimento = 0;
    let countAtendimentosValidos = 0;

    atendimentosFinalizados.forEach(atendimento => {
      try {
        // Validar se as datas são válidas
        const dataCadastro = new Date(atendimento.paciente.dataCadastro);
        const horaInicio = new Date(atendimento.horaInicio);
        const horaFim = new Date(atendimento.horaFim);

        if (isNaN(dataCadastro.getTime()) || isNaN(horaInicio.getTime()) || isNaN(horaFim.getTime())) {
          console.warn('Datas inválidas encontradas, pulando atendimento:', atendimento.id);
          return;
        }

        // Tempo de espera (cadastro até início do atendimento)
        const tempoEspera = horaInicio.getTime() - dataCadastro.getTime();
        totalTempoEspera += tempoEspera;

        // Tempo de atendimento (início até fim do atendimento)
        const tempoAtendimento = horaFim.getTime() - horaInicio.getTime();
        totalTempoAtendimento += tempoAtendimento;

        countAtendimentosValidos++;
      } catch (error) {
        console.warn('Erro ao processar atendimento:', atendimento.id, error);
      }
    });

    const tempoMedioEspera = countAtendimentosValidos > 0 
      ? totalTempoEspera / countAtendimentosValidos 
      : 0;

    const tempoMedioAtendimento = countAtendimentosValidos > 0 
      ? totalTempoAtendimento / countAtendimentosValidos 
      : 0;

    // 4. Quantidade de pacientes por prioridade
    const pacientesPorPrioridade = await prisma.paciente.groupBy({
      by: ['prioridade'],
      where: {
        atendimento: {
          some: {
            status: 'ATENDIDO'
          }
        }
      },
      _count: {
        id: true
      }
    });

    // 5. Estatísticas de status
    const pacientesPorStatus = await prisma.paciente.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    const atendimentosPorStatus = await prisma.atendimento.groupBy({
      by: ['status'],
      _count: {
        id: true
      }
    });

    // 6. Totais
    const totalPacientes = await prisma.paciente.count();
    const totalMedicos = await prisma.medico.count();

    return {
      pacientesPorMedico: pacientesPorMedico.map(medico => ({
        id: medico.id,
        nome: medico.nome,
        especialidade: medico.especialidade,
        totalAtendidos: medico._count.atendimento
      })),
      temposMedios: {
        espera: `${Math.round(tempoMedioEspera / 1000 / 60)}Min`, // converter para minutos
        atendimento: ` ${Math.round(tempoMedioAtendimento / 1000 / 60)} Min` // converter para minutos
      },
      pacientesPorPrioridade: pacientesPorPrioridade.map(item => ({
        prioridade: item.prioridade,
        quantidade: item._count.id
      })),
      pacientesPorStatus: pacientesPorStatus.map(item => ({
        status: item.status,
        quantidade: item._count.id
      })),
      atendimentosPorStatus: atendimentosPorStatus.map(item => ({
        status: item.status,
        quantidade: item._count.id
      })),
      totalAtendimentosFinalizados: countAtendimentosValidos,
      totalPacientes,
      totalMedicos,
      timestamp: new Date().toISOString()
    };

  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    throw new Error('Não foi possível gerar o relatório de estatísticas');
  }
}