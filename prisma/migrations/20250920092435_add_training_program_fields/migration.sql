/*
  Warnings:

  - Added the required column `days` to the `TrainingProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `step` to the `TrainingProgram` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weeks` to the `TrainingProgram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TrainingProgram" ADD COLUMN     "days" INTEGER NOT NULL,
ADD COLUMN     "step" INTEGER NOT NULL,
ADD COLUMN     "weeks" INTEGER NOT NULL;
