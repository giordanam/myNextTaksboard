import { IconPlus } from './Icons';
import Button from './Button';

//props
export interface HeaderProps {
  onNewTask: () => void;
}

export default function Header({ onNewTask }: HeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold">Le mie attività</h1>
      <Button className="gap-2" onClick={onNewTask}>
        <IconPlus className="size-5" />
        Nuova attività
      </Button>
    </header>
  );
}
