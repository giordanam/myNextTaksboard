import { Task } from '@/constants';
import { ApiData, formatFetchedTasks } from '@/utils/apiUtils';

const TASKS_URL = 'https://jsonplaceholder.typicode.com/todos?_limit=4';

export async function fetchTasks(): Promise<Task[]> {
  await new Promise((resolve) => setTimeout(resolve, 2000)); // per test
  const response = await fetch(TASKS_URL);
  if (!response.ok) throw new Error('Failed to fetch data');

  const data: ApiData[] = await response.json();
  return formatFetchedTasks(data);
}
