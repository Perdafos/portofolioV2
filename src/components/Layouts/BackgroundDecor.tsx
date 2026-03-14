export default function BackgroundDecor() {
  return (
    <>
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] bg-size-[50px_50px] pointer-events-none" />
      <div
        className="absolute -top-50 -right-50 w-125 h-125 bg-blue-500 rounded-full blur-[180px] opacity-50 z-0 pointer-events-none"
        style={{ pointerEvents: 'none' }}
      />
    </>
  );
}
