import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed...');

  // Limpar tabelas existentes (opcional - cuidado em produção!)
  await prisma.atendimento.deleteMany();
  await prisma.paciente.deleteMany();
  await prisma.medico.deleteMany();

  // Criar médicos sem bcrypt - usando senhas em texto simples
  const medicos = await Promise.all([
    prisma.medico.create({
      data: {
        nome: 'Dra. Ana Silva',
        especialidade: 'CARDIOLOGISTA',
        email: 'ana.silva@hospital.com',
        senha: 'senha123', // Senha em texto simples
      },
    }),
    prisma.medico.create({
      data: {
        nome: 'Dr. Carlos Oliveira',
        especialidade: 'ORTOPEDISTA',
        email: 'carlos.oliveira@hospital.com',
        senha: 'senha123',
      },
    }),
    prisma.medico.create({
      data: {
        nome: 'Dra. Mariana Santos',
        especialidade: 'PEDIATRIA',
        email: 'mariana.santos@hospital.com',
        senha: 'senha123',
      },
    }),
    prisma.medico.create({
      data: {
        nome: 'Dr. Roberto Almeida',
        especialidade: 'CARDIOLOGISTA',
        email: 'roberto.almeida@hospital.com',
        senha: 'senha123',
      },
    }),
  ]);

  // Criar pacientes
  const pacientes = await Promise.all([
    prisma.paciente.create({
      data: {
        nome: 'João da Silva',
        motivo: 'Dor no peito',
        prioridade: 'URGENTE',
        status: 'AGUARDANDO',
      },
    }),
    prisma.paciente.create({
      data: {
        nome: 'Maria Oliveira',
        motivo: 'Fratura no braço',
        prioridade: 'MODERADO',
        status: 'AGUARDANDO',
      },
    }),
    prisma.paciente.create({
      data: {
        nome: 'Pedro Santos',
        motivo: 'Check-up infantil',
        prioridade: 'LEVE',
        status: 'AGUARDANDO',
      },
    }),
    prisma.paciente.create({
      data: {
        nome: 'Ana Costa',
        motivo: 'Problemas na pele',
        prioridade: 'MODERADO',
        status: 'AGUARDANDO',
      },
    }),
    prisma.paciente.create({
      data: {
        nome: 'Luiz Fernandes',
        motivo: 'Dor abdominal intensa',
        prioridade: 'URGENTE',
        status: 'AGUARDANDO',
      },
    }),
    prisma.paciente.create({
      data: {
        nome: 'Carla Mendes',
        motivo: 'Consulta de rotina',
        prioridade: 'LEVE',
        status: 'AGUARDANDO',
      },
    }),
  ]);

  console.log(`Seed concluída com sucesso!`);
  console.log(`${medicos.length} médicos criados.`);
  console.log(`${pacientes.length} pacientes criados.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });