-- CreateTable
CREATE TABLE "public"."Athlete" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "surname" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Athlete_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."TrainingProgram" (
    "id" SERIAL NOT NULL,
    "program" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "athleteId" INTEGER NOT NULL,

    CONSTRAINT "TrainingProgram_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."TrainingProgram" ADD CONSTRAINT "TrainingProgram_athleteId_fkey" FOREIGN KEY ("athleteId") REFERENCES "public"."Athlete"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
