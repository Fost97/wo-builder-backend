-- CreateEnum
CREATE TYPE "AthleteStatus" AS ENUM ('ACTIVE', 'INACTIVE');

-- AlterTable
ALTER TABLE "Athlete" ADD COLUMN     "status" "AthleteStatus" NOT NULL DEFAULT 'ACTIVE';

-- AlterTable
ALTER TABLE "TrainingProgram" ADD COLUMN     "endDate" TIMESTAMP(3),
ADD COLUMN     "startDate" TIMESTAMP(3);
