// `className` controls width (pass `w-full` explicitly where that's wanted) —
// deliberately not defaulted here so a fixed-width use (e.g. a small square
// icon placeholder) isn't fighting a baked-in `w-full` for specificity.
export function Placeholder({ ratio = '16/10', label, className = '', rounded = 'rounded-xl' }) {
  return (
    <div
      className={`relative flex items-center justify-center bg-[hsl(var(--band))] ${rounded} overflow-hidden ${className}`}
      style={{ aspectRatio: ratio }}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent" />
      {label && (
        <span className="relative text-[11px] font-medium text-primary/45 tracking-wide px-3 text-center">
          {label}
        </span>
      )}
    </div>
  );
}
