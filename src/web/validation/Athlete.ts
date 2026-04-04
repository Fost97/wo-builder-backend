import * as z from 'zod';
import { AthleteStatus } from '../../generated/prisma/enums.js';

export const AthleteCreationSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters'),
  surname: z.string().min(1, 'Surname is required').max(255, 'Surname must be at most 255 characters'),
  status: z.enum(AthleteStatus).default(AthleteStatus.ACTIVE),
});

export const AthleteUpdateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name must be at most 255 characters').optional(),
  surname: z.string().min(1, 'Surname is required').max(255, 'Surname must be at most 255 characters').optional(),
  status: z.enum(AthleteStatus).optional(),
});
