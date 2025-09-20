/*
  Warnings:

  - Added the required column `label` to the `TrainingProgram` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."TrainingProgram" ADD COLUMN     "label" TEXT NOT NULL;
