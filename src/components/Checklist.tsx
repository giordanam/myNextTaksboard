import { useState, KeyboardEvent } from 'react';
import { IconCheck, IconPlus } from './Icons';

// definiamo la forma di un singolo elemento della checklist
export interface ChecklistItemType {
  id: string;
  text: string;
  done: boolean;
}

//props
interface ChecklistProps {
  checklist: ChecklistItemType[];
  setChecklist: (items: ChecklistItemType[]) => void;
}

export default function Checklist({ checklist, setChecklist }: ChecklistProps) {
  const [newItemText, setNewItemText] = useState('');

  function toggleItem(itemId: string) {
    setChecklist(
      checklist.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item))
    );
  }

  function addItem() {
    const text = newItemText.trim();
    if (!text) return;

    setChecklist([...checklist, { id: crypto.randomUUID(), text, done: false }]);
    setNewItemText('');
  }

  function handleKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      addItem();
    }
  }

  return (
    <div>
      <h3 className="mb-2 mt-4 text-sm font-bold text-gray-700 flex items-center gap-2">
        <IconCheck className={'size-4'} />
        Checklist
      </h3>
      <div className="space-y-2 mb-3">
        {checklist.map((item) => (
          <label key={item.id} className="flex items-center gap-3 p-2">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleItem(item.id)}
              className="w-4 h-4 text-sky-600 rounded border-gray-300 focus:ring-sky-500"
            />
            <span className="text-sm text-gray-700"> {item.text}</span>
          </label>
        ))}
        <div className="flex items-center gap-3 p-2 mt-1">
          <button type="button" onClick={addItem}>
            <IconPlus />
          </button>
          <input
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Aggiungi elemento..."
            className="w-full text-sm bg-transparent border-b focus:border-sky-500 focus:outline-none text-gray-700 pb-1"
          />
        </div>
      </div>
    </div>
  );
}
