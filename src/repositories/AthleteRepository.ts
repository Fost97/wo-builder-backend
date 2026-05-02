import type { Athlete, ReadonlyAthlete } from "../models/index.js";

import prisma from "../lib/index.js";
import { Prisma } from "../generated/prisma/client.js";

class AthleteRepository {
  private static instance: AthleteRepository | null = null;

  private constructor() {}

  public static getInstance(): AthleteRepository {
    if (!AthleteRepository.instance) {
      AthleteRepository.instance = new AthleteRepository();
    }
    return AthleteRepository.instance;
  }

  public async findAll({ orderBy }: { orderBy: Prisma.AthleteOrderByWithRelationInput | Prisma.AthleteOrderByWithRelationInput[] }): Promise<ReadonlyAthlete[]> {
    return prisma.athlete.findMany({ orderBy });
  }

  public async count(): Promise<number> {
    return prisma.athlete.count();
  }

  public async create(data: Omit<Athlete, "id">): Promise<ReadonlyAthlete> {
    return prisma.athlete.create({ data });
  }

  public async findById(id: number): Promise<ReadonlyAthlete | null> {
    return prisma.athlete.findFirst({ where: { id } });
  }

  public async update(id: number, data: Partial<Omit<Athlete, "id">>): Promise<ReadonlyAthlete> {
    return prisma.athlete.update({ where: { id }, data });
  }

  public async delete(id: number): Promise<void> {
    await prisma.athlete.delete({ where: { id } });
  }
  }

export default AthleteRepository.getInstance();
