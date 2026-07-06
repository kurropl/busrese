const items = [
  { label: "Libre", cls: "bg-[#d1fae5] border border-[#6ee7b7]" },
  { label: "Ocupado", cls: "bg-[#dbeafe] border border-[#93c5fd]" },
  { label: "Conductor", cls: "bg-[#fef3c7] border border-[#fcd34d]" },
  { label: "Guía", cls: "bg-[#ede9fe] border border-[#c4b5fd]" },
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
