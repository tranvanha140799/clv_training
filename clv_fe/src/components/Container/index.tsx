import React, { ReactNode } from 'react';
import { Header } from '..';

export const Container: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <>
      <Header />
      <section className="bg-ct-blueprint-600">
        <div className="max-w-full mx-auto bg-ct-dark-100 rounded-md h-[calc(100vh-5rem)] flex justify-center items-baseline">
          {children}
        </div>
      </section>
    </>
  );
};
