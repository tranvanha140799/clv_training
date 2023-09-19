export const Section: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <section className="min-h-screen grid place-items-center bg-blueprint">
      {children}
    </section>
  );
};
