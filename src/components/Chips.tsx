interface Props<T extends number> {
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}

/** Grupo de opções em "pílulas" (substitui o <select>). */
export function Chips<T extends number>({ label, options, value, onChange }: Props<T>) {
  return (
    <div className="chips" role="radiogroup" aria-label={label}>
      <span className="chips-label">{label}</span>
      <div className="chips-row">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={o.value === value}
            className={o.value === value ? "chip active" : "chip"}
            onClick={() => onChange(o.value)}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}
