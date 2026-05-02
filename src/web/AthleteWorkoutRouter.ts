import express from "express";
import WorkoutService from "../services/WorkoutService.js";
import { type Workout } from "../models/index.js";

const router = express.Router({ mergeParams: true });

router
  .get("/", async (req, res) => {
    const athleteId = Number((req.params as {[key: string]: string}).id);
    const { count, rows } = await WorkoutService.findAndCountAllByAthleteId(athleteId);
    res.json({ count, rows });
  })
  .post("/", async (req, res) => {
    const workout = {} as Workout;
    workout.athleteId = Number((req.params as {[key: string]: string}).id);
    workout.label = req.body.label;
    workout.weeks = Number(req.body.weeks);
    workout.days = Number(req.body.days);
    workout.startDate = new Date(req.body.startDate);
    workout.endDate = new Date(req.body.endDate);
    const trainingProgram = await WorkoutService.create(workout);
    res.status(201).json(trainingProgram);
  });

router.get("/pinned", async (req, res) => {
  const athleteId = Number((req.params as {[key: string]: string}).id);
  const response = await WorkoutService.findPinnedByAthleteId(athleteId);
  res.json(response);
});

export default router;
