export default function Section({ children }: { children: React.ReactNode }) {
  return (
    <section className="min-h-screen grid place-items-center bg-blueprint">
      {children}
    </section>
  );
}
