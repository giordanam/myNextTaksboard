// Definiamo il requisito minimo per le opzioni
export interface SelectOption {
  value: string;
  label: string;
}

// props
interface FormSelectProps {
  label: string;
  name: string;
  defaultValue?: string; // Opzionale
  options: SelectOption[]; // Un array di oggetti che hanno ALMENO value e label
  disabled?: boolean; // Opzionale
}

export default function FormSelect({
  label,
  name,
  defaultValue,
  options,
  disabled = false, // Valore di default sicuro
}: FormSelectProps) {
  return (
    <>
      <label className="mt-3 block text-xs font-bold text-gray-500">
        {label}
        <select
          name={disabled ? '' : name} // Se è disabilitato, togliamo il name per il FormData
          defaultValue={defaultValue}
          disabled={disabled}
          className={`mt-1 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 rounded-xl w-full py-2 px-3 ${
            disabled ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-white text-gray-900'
          }`}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </label>

      {/* Se la select è bloccata, usiamo un campo nascosto per inviare comunque il dato al salvataggio */}
      {disabled && <input type="hidden" name={name} value={defaultValue} />}
    </>
  );
}
