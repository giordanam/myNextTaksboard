import { USERS, CATEGORIES, Task } from '@/constants';
import { IconTime } from './Icons';
import Link from 'next/link';

interface CardProps {
  task: Task;
}

export default function Card({ task }: CardProps) {
  const category = CATEGORIES.find((category) => task.category === category.value);
  const user = USERS.find((user) => task.user === user.value);
  return (
    <Link
      href={`/task/${task.id}`}
      className="bg-white p-4 rounded-lg shadow cursor-pointer block hover:shadow-md transition-shadow"
    >
      <div className="mb-2">
        <span className="inline-block px-2 py-1 font-bold text-sky-700 bg-sky-100 rounded">
          {category?.label || 'no label'}
        </span>
      </div>
      <h3 className="text-sm font-bold text-gray-800 mb-4">{task.title}</h3>
      <div className="flex justify-between items-center mt-auto">
        <div className="flex items-center gap-1">
          <IconTime className={'size-6'} />
          <span>{task.expire.split('-').reverse().join('/')}</span>
        </div>
        <div className="w-9 h-9 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center">
          {user?.initials || '?'}
        </div>
      </div>
    </Link>
  );
}
