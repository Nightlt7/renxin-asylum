export default function Scanlines() {
  return (
    <div
      className="pointer-events-none fixed inset-0 z-[100] opacity-[0.06]"
      style={{
        background:
          'repeating-linear-gradient(0deg, rgba(0,0,0,0.15), rgba(0,0,0,0.15) 1px, transparent 1px, transparent 4px)',
      }}
    />
  );
}
