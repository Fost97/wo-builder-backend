import express from "express";
import AthleteService from "../services/AthleteService.js";
import { type Athlete } from "../generated/prisma/client.js";

import {
  AthleteCreationSchema,
  AthleteUpdateSchema,
} from "./validation/Athlete.js";

const router = express.Router();

router
  .get("/", async (req, res) => {
    const { rows, count } = await AthleteService.findAndCountAll({ orderBy: { id: "asc" } });
    res.json({ count, rows });
  })
  .post("/", async (req, res) => {
    const result = AthleteCreationSchema.safeParse(req.body);
    if (!result.success) {
      return res.status(400).jsonp(result.error.issues)
    }
    const athleteToCreate = result.data as Omit<Athlete, "id">;
    const athlete = await AthleteService.create(athleteToCreate);
    res.status(201).json(athlete);
  });

router
  .get("/:id", async (req, res) => {
    const id = Number(req.params.id);
    const athlete = await AthleteService.findById(id);
    if (!athlete) {
      return res.status(404).end();
    }
    res.json(athlete);
  })
  .put("/:id", async (req, res) => {
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
    const athlete = await AthleteService.update(id, data);
    res.json(athlete);
  })
  .delete("/:id", async (req, res) => {
    const id = Number(req.params.id);
    await AthleteService.delete(id);
    res.json();
  });

export default router;
