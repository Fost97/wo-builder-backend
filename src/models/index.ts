import { AthleteStatus } from '../generated/prisma/enums.js';
import type { Prisma } from '../generated/prisma/client.js';

export interface Athlete {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
    surname: string;
    status: AthleteStatus;
}

export interface ReadonlyAthlete extends Readonly<Athlete> {}

export interface Workout {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    athleteId: number;
    label: string;
    program: Prisma.JsonValue;
    days: number;
    weeks: number;
    step: number;
    pinned: boolean;
    startDate: Date | null;
    endDate: Date | null;
}

export interface ReadonlyWorkout extends Readonly<Workout> {}