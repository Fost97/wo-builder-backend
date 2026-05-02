import type { ReadonlyWorkout } from "../models/index.js";

import prisma from "../lib/index.js";
import { Prisma } from "../generated/prisma/client.js";

class WorkoutRepository {
  private static instance: WorkoutRepository | null = null;

  private constructor() { }

  public static getInstance(): WorkoutRepository {
    if (!WorkoutRepository.instance) {
      WorkoutRepository.instance = new WorkoutRepository();
    }
    return WorkoutRepository.instance;
  }

  public async findAllByAthleteId(athleteId: number): Promise<ReadonlyWorkout[]> {
    return prisma.trainingProgram.findMany({ where: { athleteId }, orderBy: { createdAt: "desc" } });
  }

  public async countByAthleteId(athleteId: number): Promise<number> {
    return prisma.trainingProgram.count({ where: { athleteId } });
  }

  public async findByAthleteId(athleteId: number): Promise<ReadonlyWorkout | null> {
    return prisma.trainingProgram.findFirst({ where: { athleteId } });
  }

  public async findPinnedByAthleteId(athleteId: number): Promise<ReadonlyWorkout | null> {
    return prisma.trainingProgram.findFirst({ where: { athleteId, pinned: true } });
  }

  public async create(workout: Prisma.TrainingProgramCreateInput | Prisma.TrainingProgramUncheckedCreateInput): Promise<ReadonlyWorkout> {
    return prisma.trainingProgram.create({ data: workout as any });
  }

  public async findById(id: number): Promise<ReadonlyWorkout | null> {
    return prisma.trainingProgram.findFirst({ where: { id } });
  }

  public async update(id: number, data: Prisma.TrainingProgramUpdateInput | Prisma.TrainingProgramUncheckedUpdateInput): Promise<ReadonlyWorkout> {
    return prisma.trainingProgram.update({ where: { id }, data: data as any });
  }

  public async updateMany(data: Prisma.TrainingProgramUpdateManyMutationInput, where: Prisma.TrainingProgramWhereInput): Promise<void> {
    await prisma.trainingProgram.updateMany({ data: data as any, where });
  }

  public async delete(id: number): Promise<void> {
    await prisma.trainingProgram.delete({ where: { id } });
  }

}

export default WorkoutRepository.getInstance();
