import type { ReadonlyWorkout } from "../models/index.js";
import WorkoutRepository from "../repositories/WorkoutRepository.js";
import { Prisma } from "../generated/prisma/client.js";

class WorkoutService {

  private static instance: WorkoutService | null = null;

  private constructor() { }

  public static getInstance(): WorkoutService {
    if (!WorkoutService.instance) {
      WorkoutService.instance = new WorkoutService();
    }
    return WorkoutService.instance;
  }

  private static emptyRow() {
    return { name: "", sets: "", reps: "", kg: "", rec: "", note: "" };
  }

  private static emptyProgram(weeks: number, days: number) {
    const program = [];
    for (let j = 0; j < days; j++) {
      program.push([this.emptyRow()]);
    }
    return program;
  }

  public async findAndCountAllByAthleteId(athleteId: number): Promise<{ count: number; rows: ReadonlyWorkout[] }> {
    return Promise.all([
      WorkoutRepository.findAllByAthleteId(athleteId),
      WorkoutRepository.countByAthleteId(athleteId),
    ]).then(([rows, count]) => ({ count, rows }));
  }

  public async findByAthleteId(athleteId: number): Promise<ReadonlyWorkout | null> {
    return WorkoutRepository.findByAthleteId(athleteId);
  }

  public async findPinnedByAthleteId(athleteId: number): Promise<ReadonlyWorkout | null> {
    return WorkoutRepository.findPinnedByAthleteId(athleteId);
  }

  public async create(workout: Omit<ReadonlyWorkout, "id" | "createdAt" | "updatedAt">): Promise<ReadonlyWorkout> {
    const program = WorkoutService.emptyProgram(workout.weeks, workout.days);
    const firstWorkout = await WorkoutRepository.findByAthleteId(workout.athleteId);

    const pinned = !firstWorkout;
    const fullWorkout = {
      ...workout,
      program,
      step: 0,
      pinned
    };

    return WorkoutRepository.create(fullWorkout);
  }

  public async findById(id: number): Promise<ReadonlyWorkout | null> {
    return WorkoutRepository.findById(id);
  }

  public async update(id: number, data: Partial<Omit<ReadonlyWorkout, "id" | "createdAt" | "updatedAt">>): Promise<ReadonlyWorkout> {
    return WorkoutRepository.update(id, data as any);
  }

  public async delete(id: number): Promise<void> {
    await WorkoutRepository.delete(id);
  }

  public async clone(id: number, label: string): Promise<ReadonlyWorkout> {
    const workoutToClone = await WorkoutRepository.findById(id);
    if (!workoutToClone) {
      throw new Error("Workout not found");
    }
    const { athleteId, weeks, days, step, startDate, endDate, program } = workoutToClone;
    return WorkoutRepository.create({
      athleteId,
      label,
      weeks,
      days,
      step,
      startDate,
      endDate,
      program: program as Prisma.InputJsonValue
    } as any);
  }

  public async pin(id: number): Promise<void> {
    const workout = await WorkoutRepository.findById(id);
    if (!workout) {
      throw new Error("Workout not found");
    }
    await WorkoutRepository.updateMany({ pinned: false }, { athleteId: workout.athleteId });
    await WorkoutRepository.update(id, { pinned: true });
  }
}

export default WorkoutService.getInstance();
