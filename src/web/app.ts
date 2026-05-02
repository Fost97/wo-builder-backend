import cors from "cors";
import express from "express";

import athleteRouter from "./AthleteRouter.js";
import workoutRouter from "./WorkoutRouter.js";
import athleteWorkoutRouter from "./AthleteWorkoutRouter.js";

const app = express();

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => res.send("OK"));

app.use("/athletes", athleteRouter);
app.use("/workouts", workoutRouter);
app.use("/athletes/:id/workouts", athleteWorkoutRouter);

export default app;
