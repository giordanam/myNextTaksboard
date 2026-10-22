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
      className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition-shadow flex flex-col h-full"
    >
      <div className="mb-2">
        <span className="inline-block px-2 py-1 font-bold text-sky-700 bg-sky-100 rounded text-s">
          {category?.label || 'no label'}
        </span>
      </div>
      <h3 className="text-ml font-bold text-gray-800 mb-4 break-words line-clamp-2">
        {task.title}
      </h3>
      <div className="flex justify-between items-center mt-auto pt-4 border-t border-gray-100">
        <div className="flex items-center gap-1 text-gray-500 text-m">
          <IconTime className={'size-5'} />
          <span>{task.expire.split('-').reverse().join('/')}</span>
        </div>
        <div
          className="w-10 h-10 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center text-sm font-bold"
          title={user?.label}
        >
          {user?.initials || '?'}
        </div>
      </div>
    </Link>
  );
}
