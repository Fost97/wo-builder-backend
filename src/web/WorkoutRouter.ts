import express from "express";
import WorkoutService from "../services/WorkoutService.js";

const router = express.Router();

router
  .get("/:id", async (req, res) => {
    const workoutId = Number(req.params.id);
    const trainingProgram = await WorkoutService.findById(workoutId);
    if (!trainingProgram) {
      res.status(404).end();
      return;
    }
    res.json(trainingProgram);
  })
  .put("/:id", async (req, res) => {
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

    const trainingProgram = await WorkoutService.update(workoutId, data);
    res.json(trainingProgram);
  })
  .delete("/:id", async (req, res) => {
    const id = Number(req.params.id);

    await WorkoutService.delete(id);
    res.json();
  })

router.post("/:id/clone", async (req, res) => {
  const workoutId = Number(req.params.id);
  const label = req.body.label;
  const workout = await WorkoutService.clone(workoutId, label);
  res.json(workout);
});

router.put("/:id/pin", async (req, res) => {
  const workoutId = Number(req.params.id);
  await WorkoutService.pin(workoutId);
  res.end();
});

export default router;
