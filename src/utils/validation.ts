import { z } from 'zod';
import { STATUS, CATEGORIES, EXPIRES } from '@/constants';

const validStatuses = STATUS.map((s) => s.value) as [string, ...string[]];
const validCategories = CATEGORIES.map((c) => c.value) as [string, ...string[]];
const validExpires = EXPIRES.map((e) => e.value) as [string, ...string[]];

export const statusSchema = z.enum(validStatuses);

export const checklistItemSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, 'Il testo non può essere vuoto'),
  done: z.boolean().default(false),
});

export const taskSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1, 'Il titolo è obbligatorio'),

  category: z.enum(validCategories),
  status: z.enum(validStatuses),
  expire: z.enum(validExpires),
  userId: z.string().min(1, 'Utente obbligatorio'),

  description: z.string().nullable().optional(),
  checklist: z.array(checklistItemSchema).optional().default([]),
});
