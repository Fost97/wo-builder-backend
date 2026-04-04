import * as z from 'zod';

export const TrainingProgramCreationSchema = z.object({
  label: z.string().min(1, 'Label is required'),
  program: z.json(),
  days: z.number().min(1).max(7, 'Days must be between 1 and 7'),
  weeks: z.number().min(1, 'Weeks must be a positive number'),
  step: z.number().min(1).max(4),
  startDate: z.date().optional(),
  endDate: z.date().optional(),
});

export const TrainingProgramUpdateSchema = z.object({
  label: z.string().min(1, 'Label is required').optional(),
  program: z.json().optional(),
  days: z.number().min(1).max(7, 'Days must be between 1 and 7').optional(),
  weeks: z.number().min(1, 'Weeks must be a positive number').optional(),
  step: z.number().min(1).max(4).optional(),
});

