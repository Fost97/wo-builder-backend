import cors from "cors";
import express from "express";

import prisma from "../lib/index.js";

import Workout from "../services/workout.js";
import { Prisma } from "../generated/prisma/client.js";
import {
  AthleteCreationSchema,
  AthleteUpdateSchema,
} from "./validation/Athlete.js";

import {
  TrainingProgramCreationSchema,
  TrainingProgramUpdateSchema,
} from "./validation/TrainingProgram.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("OK"));

app.get("/athletes", async (req, res) => {
  const athletes = await prisma.athlete.findMany({ orderBy: { id: "asc" } });
  const athletesCount = await prisma.athlete.count();
  res.json({ count: athletesCount, rows: athletes });
});

app.post("/athletes", async (req, res) => {
  const result = AthleteCreationSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).jsonp(result.error.issues)
  }

  const athlete = await prisma.athlete.create({
    data: { ...result.data },
  });
  res.status(201).json(athlete);
});

app.get("/athletes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const athlete = await prisma.athlete.findFirst({ where: { id } });
  res.json(athlete);
});

app.put("/athletes/:id", async (req, res) => {
  const result = AthleteUpdateSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).jsonp(result.error.issues)
  }
  
  const id = Number(req.params.id);
  const data: Record<string, unknown> = Object.fromEntries(Object.entries(result.data).filter(([_, value]) => value !== undefined));
  if (!Object.keys(data).length) {
    res.end();
    return;
  }
  const athlete = await prisma.athlete.update({
    data,
    where: { id },
  });
  res.json(athlete);
});


app.delete("/athletes/:id", async (req, res) => {
  const id = Number(req.params.id);
  // First check if the athlete has training programs
  const trainingPrograms = await prisma.trainingProgram.count({
    where: { athleteId: id },
  });
  if (trainingPrograms > 0) {
    res.status(400).end();
    return;
  }

  prisma.athlete.delete({ where: { id } });
  res.json();
});

app.get("/athletes/:id/workouts", async (req, res) => {
  const athleteId = Number(req.params.id);
  const trainingPrograms = await prisma.trainingProgram.findMany({ where: { athleteId } });
  const trainingProgramsCount = await prisma.trainingProgram.count({ where: { athleteId } });
  res.json({ count: trainingProgramsCount, rows: trainingPrograms });
});

app.get("/athletes/:id/workouts/pinned", async (req, res) => {
  const athleteId = Number(req.params.id);
  const trainingProgram = await prisma.trainingProgram.findFirst({ where: { athleteId, pinned: true } });
  res.json(trainingProgram);
});

app.post("/athletes/:id/workouts", async (req, res) => {
  const athleteId = Number(req.params.id);
  const label = req.body.label;
  const weeks = Number(req.body.weeks);
  const days = Number(req.body.days);
  const startDate = new Date(req.body.startDate);
  const endDate = new Date(req.body.endDate);
  const trainingProgram = await Workout.create(athleteId, label, weeks, days, startDate, endDate);
  res.status(201).json(trainingProgram);
});

app.get("/workouts/:id", async (req, res) => {
  const workoutId = Number(req.params.id);
  try {
    const trainingProgram = await prisma.trainingProgram.findFirstOrThrow({
      where: { id: workoutId },
    });
    res.json(trainingProgram);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2025") {
      res.status(404).end();
      return;
    }
    throw error;
  }
});

app.post("/workouts/:id/clone", async (req, res) => {
  const workoutId = Number(req.params.id);
  const label = req.body.label;
  const trainingProgramToClone = await prisma.trainingProgram.findFirst({
    where: { id: workoutId },
  });
  if (!trainingProgramToClone) {
    return res.status(404).end();
  }
  const trainingProgram = await prisma.trainingProgram.create({
    data: {
      label,
      weeks: trainingProgramToClone.weeks,
      days: trainingProgramToClone.days,
      step: trainingProgramToClone.step,
      startDate: trainingProgramToClone.startDate,
      endDate: trainingProgramToClone.endDate,
      program: trainingProgramToClone.program as Prisma.InputJsonValue,
      athleteId: trainingProgramToClone.athleteId,
    },
  });

  res.json(trainingProgram);
});

app.put("/workouts/:id", async (req, res) => {
  const data: Record<string, unknown> = {};

  const workoutId = Number(req.params.id);
  const program = req.body.program;
  const label = req.body.label;
  const weeks = req.body.weeks;
  const step = req.body.step;
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;

  if (program) {
    data.program = program;
    data.days = program.length;
  }
  if (label) data.label = label;
  if (weeks) data.weeks = weeks;
  if (step !== null && step !== undefined) data.step = step;
  if (startDate) data.startDate = startDate;
  if (endDate) data.endDate = endDate;
  if (!Object.keys(data).length) {
    res.end();
    return;
  }

  const trainingProgram = await prisma.trainingProgram.update({
    data,
    where: { id: workoutId },
  });
  res.json(trainingProgram);
});

app.put("/workouts/:id/pin", async (req, res) => {
  const workoutId = Number(req.params.id);
  
  const trainingProgram = await prisma.trainingProgram.findFirst({
    where: { id: workoutId }
  })
  if (!trainingProgram) {
    return res.status(404).end()
  }

  await prisma.trainingProgram.updateMany({
    data: { pinned: false },
    where: { athleteId: trainingProgram.athleteId, pinned: true }
  })

  await prisma.trainingProgram.update({
    data: { pinned: true },
    where: { id: workoutId }
  });

  res.end();
});

app.delete("/workout/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.trainingProgram.delete({ where: { id } });
  res.json();
});

export default app;
