'use server';

import { prisma } from '@/lib/prisma';
import type { Task } from '@/constants';

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
export async function saveTaskToDb(task: Task) {
  const { id, checklist, ...taskData } = task;

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
  await prisma.task.delete({ where: { id: String(id) } });
}

// AGGIORNA SOLO LO STATO (Drag & Drop)
export async function updateTaskStatusInDb(id: string | number, status: string) {
  await prisma.task.update({
    where: { id: String(id) },
    data: { status },
  });
}

// ELIMINA TUTTI I TASK
export async function deleteAllTasksFromDb() {
  await prisma.task.deleteMany({});
}
