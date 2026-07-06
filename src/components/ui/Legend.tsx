const items = [
  { label: "Libre",      cls: "bg-[#10b981] border-2 border-[#047857]" },
  { label: "Ocupado",    cls: "bg-[#cbd5e1] border-2 border-[#94a3b8]" },
  { label: "Conductor",  cls: "bg-[#fbbf24] border-2 border-[#d97706]" },
  { label: "Guía",       cls: "bg-[#c4b5fd] border-2 border-[#8b5cf6]" },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className={`inline-block w-4 h-4 rounded ${it.cls}`} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
