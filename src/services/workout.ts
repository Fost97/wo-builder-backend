import prisma from "../lib/index.js";

export default class Workout {
  private static emptyRow() {
    return { name: "", sets: "", reps: "", kg: "", rec: "", note: "" };
  }

  public static async create(
    athleteId: number,
    label: string,
    weeks: number,
    days: number,
    startDate: Date,
    endDate: Date
  ) {
    // First initialize the workout
    const program = [];
    for (let i = 0; i < 3; i++) {
      program.push([this.emptyRow()]);
    }

    // check if the athlete already has a workout, if not, the one created will be "pinned"
    const trainingProgramData = {
        program,
        athleteId,
        label,
        weeks,
        days,
        step: 0,
        pinned: false,
        startDate,
        endDate
      }
    const existingWorkout = await prisma.trainingProgram.findFirst({
      where: { athleteId }
    })
    if (!existingWorkout) {
      trainingProgramData.pinned = true;
    }
    
    const trainingProgram = await prisma.trainingProgram.create({
      data: trainingProgramData,
    });
    return trainingProgram;
  }
}
