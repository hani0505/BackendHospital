/*
  Warnings:

  - The values [MODERADO,LEVE] on the enum `Prioridade` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Prioridade_new" AS ENUM ('EMERGÊNCIA', 'MUITO_URGENTE', 'URGENTE', 'POUCO_URGENTE', 'NÃO_URGENTE');
ALTER TABLE "public"."Paciente" ALTER COLUMN "prioridade" TYPE "public"."Prioridade_new" USING ("prioridade"::text::"public"."Prioridade_new");
ALTER TYPE "public"."Prioridade" RENAME TO "Prioridade_old";
ALTER TYPE "public"."Prioridade_new" RENAME TO "Prioridade";
DROP TYPE "public"."Prioridade_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "public"."Status" ADD VALUE 'AGUARDANDO_TRIAGEM';
ALTER TYPE "public"."Status" ADD VALUE 'AGUARDANDO_MEDICO';
