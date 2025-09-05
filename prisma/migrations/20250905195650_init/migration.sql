-- CreateEnum
CREATE TYPE "public"."Prioridade" AS ENUM ('URGENTE', 'MODERADO', 'LEVE');

-- CreateEnum
CREATE TYPE "public"."Status" AS ENUM ('AGUARDANDO', 'EM_ATENDIMENTO', 'ATENDIDO');

-- CreateEnum
CREATE TYPE "public"."Especialidade" AS ENUM ('CARDIOLOGISTA', 'PEDIATRIA', 'ORTOPEDISTA');

-- CreateTable
CREATE TABLE "public"."Paciente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "motivo" TEXT NOT NULL,
    "prioridade" "public"."Prioridade" NOT NULL,
    "status" "public"."Status" NOT NULL DEFAULT 'AGUARDANDO',
    "dataCadastro" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Paciente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Medico" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "especialidade" "public"."Especialidade" NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Medico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Atendente" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,

    CONSTRAINT "Atendente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Atendimento" (
    "id" TEXT NOT NULL,
    "pacienteId" TEXT NOT NULL,
    "medicoId" TEXT NOT NULL,
    "horaInicio" TIMESTAMP(3) NOT NULL,
    "horaFim" TIMESTAMP(3),
    "status" "public"."Status" NOT NULL,

    CONSTRAINT "Atendimento_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Medico_email_key" ON "public"."Medico"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Atendente_email_key" ON "public"."Atendente"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Atendimento_medicoId_pacienteId_key" ON "public"."Atendimento"("medicoId", "pacienteId");

-- AddForeignKey
ALTER TABLE "public"."Atendimento" ADD CONSTRAINT "Atendimento_medicoId_fkey" FOREIGN KEY ("medicoId") REFERENCES "public"."Medico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Atendimento" ADD CONSTRAINT "Atendimento_pacienteId_fkey" FOREIGN KEY ("pacienteId") REFERENCES "public"."Paciente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
