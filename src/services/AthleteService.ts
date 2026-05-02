import {
  type Athlete,
  type ReadonlyAthlete
} from "../models/index.js";
import AthleteRepository from "../repositories/AthleteRepository.js";
import WorkoutService from "./WorkoutService.js";

class AthleteService {

  private static instance: AthleteService | null = null;

  private constructor() {}

  public static getInstance(): AthleteService {
    if (!AthleteService.instance) {
      AthleteService.instance = new AthleteService();
    }
    return AthleteService.instance;
  }

  public async findAndCountAll({ orderBy }: { orderBy: any }): Promise<{ count: number; rows: ReadonlyAthlete[] }> {
    return Promise.all([
      AthleteRepository.findAll({ orderBy }),
      AthleteRepository.count(),
    ]).then(([rows, count]) => ({ count, rows }));
  }

  public async create(data: Omit<Athlete, "id">): Promise<ReadonlyAthlete> {
    return AthleteRepository.create(data);
  }

  public async findById(id: number): Promise<ReadonlyAthlete | null> {
    return AthleteRepository.findById(id);
  }

  public async update(id: number, data: Partial<Omit<Athlete, "id">>): Promise<ReadonlyAthlete> {
    return AthleteRepository.update(id, data);
  }

  public async delete(id: number): Promise<void> {
    const workout = await WorkoutService.findByAthleteId(id)
    if (workout) {
      throw new Error("Can't delete Athlete with Workouts")
    }
    await AthleteRepository.delete(id);
  }
}

export default AthleteService.getInstance();
