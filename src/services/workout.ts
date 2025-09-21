import prisma from "../db/index.js";

export default class Workout {
  private static emptyRow() {
    return { name: "", sets: "", reps: "", kg: "", rec: "", note: "" };
  }

  public static async create(athleteId: number, label: string, weeks: number, days: number) {
    // First initialize the workout
    const program = [];
    for (let i = 0; i < 3; i++) {
      program.push([this.emptyRow()]);
    }

    const trainingProgram = await prisma.trainingProgram.create({
      data: {
        program,
        athleteId,
        label,
        weeks,
        days,
        step: 0,
      },
    });
    return trainingProgram;
  }
}
