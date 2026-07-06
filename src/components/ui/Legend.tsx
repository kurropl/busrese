const items = [
  { label: "Libre", cls: "bg-seat-libre" },
  { label: "Ocupado", cls: "bg-seat-ocupado" },
  { label: "Conductor", cls: "bg-seat-conductor" },
  { label: "Guía", cls: "bg-seat-guia" },
];

export default function Legend() {
  return (
    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-600">
      {items.map((it) => (
        <span key={it.label} className="flex items-center gap-1.5">
          <span className={`inline-block w-3 h-3 rounded ${it.cls}`} />
          {it.label}
        </span>
      ))}
    </div>
  );
}
