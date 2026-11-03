'use server';

import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import { statusSchema, taskSchema } from '@/utils/validation';

export async function fetchTasks() {
  if (process.env.NEXT_PUBLIC_ENABLE_DEBUG === 'true') {
    await new Promise((resolve) => setTimeout(resolve, 2000));
  }

  const tasks = await prisma.task.findMany({
    include: {
      checklist: true,
    },
  });
  return tasks;
}

// SALVA O AGGIORNA UN TASK
export async function saveTaskToDb(task: unknown) {
  const validTask = taskSchema.parse(task);
  const { id, checklist, ...taskData } = validTask;

  // upsert: aggiorna se esiste, altrimenti crea un nuovo task
  return await prisma.task.upsert({
    where: { id: String(id) },
    update: {
      ...taskData,
      checklist: {
        deleteMany: {},
        create: checklist?.map((item) => ({ text: item.text, done: item.done })) || [],
      },
    },
    create: {
      id: String(id),
      ...taskData,
      checklist: {
        create: checklist?.map((item) => ({ text: item.text, done: item.done })) || [],
      },
    },
    include: { checklist: true },
  });
}

// ELIMINA UN TASK
export async function deleteTaskFromDb(id: string | number) {
  const validId = z.string().min(1).parse(String(id));
  await prisma.task.delete({ where: { id: validId } });
}

// AGGIORNA SOLO LO STATO (Drag & Drop)
export async function updateTaskStatusInDb(id: string | number, status: string) {
  const validId = z.string().min(1).parse(String(id));
  const validStatus = statusSchema.parse(status);
  await prisma.task.update({
    where: { id: validId },
    data: { status: validStatus },
  });
}

// ELIMINA TUTTI I TASK
export async function deleteAllTasksFromDb() {
  await prisma.task.deleteMany({});
}
