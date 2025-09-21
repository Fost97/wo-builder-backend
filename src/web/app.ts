import cors from "cors";
import express from "express";

import prisma from "../db/index.js";

import { Prisma } from "@prisma/client";
import Workout from "../services/workout.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("OK"));

app.get("/athletes", async (req, res) => {
  const athletes = await prisma.athlete.findMany();
  res.json(athletes);
});

app.post("/athletes", async (req, res) => {
  const { name, surname } = req.body;
  const athlete = await prisma.athlete.create({
    data: { name, surname },
  });
  res.status(201).json(athlete);
});

app.get("/athletes/:id", async (req, res) => {
  const id = Number(req.params.id);
  const athlete = await prisma.athlete.findFirst({ where: { id } });
  res.json(athlete);
});

app.put("/athletes/:id", async (req, res) => {
  const data: Record<string, unknown> = {};
  const id = Number(req.params.id);
  const { name, surname } = req.body;
  if (name) data.name = name;
  if (surname) data.surname = surname;

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
  res.json(trainingPrograms);
});

app.post("/athletes/:id/workouts", async (req, res) => {
  const athleteId = Number(req.params.id);
  const label = req.body.label;
  const weeks = Number(req.body.weeks);
  const days = Number(req.body.days);
  const trainingProgram = await Workout.create(athleteId, label, weeks, days);
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

  if (program) {
    data.program = program;
    data.days = program.length;
  }
  if (label) data.label = label;
  if (weeks) data.weeks = weeks;
  if (step !== null && step !== undefined) data.step = step;
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

app.delete("/workout/:id", async (req, res) => {
  const id = Number(req.params.id);

  await prisma.trainingProgram.delete({ where: { id } });
  res.json();
});

export default app;
