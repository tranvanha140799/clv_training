'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks';
import Header from '@/components/Header';

export default function Home() {
  return (
    <>
      <Header />
      <section className="bg-ct-blue-600 min-h-screen pt-20">
        <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
          <p className="text-5xl font-semibold">Home Page</p>
        </div>
      </section>
    </>
    // <main style={{ maxWidth: 1200, marginInline: 'auto', padding: 20 }}>
    //   <div style={{ marginBottom: '4rem', textAlign: 'center' }}>
    //     <h4 style={{ marginBottom: 16 }}>{count}</h4>
    //     <button onClick={() => dispatch(increment())}>increment</button>
    //     <button onClick={() => dispatch(decrement())} style={{ marginInline: 16 }}>
    //       decrement
    //     </button>
    //     <button onClick={() => dispatch(reset())}>reset</button>
    //   </div>
    //   {error ? (
    //     <p>Oh no, there was an error!</p>
    //   ) : isLoading || isFetching ? (
    //     <p>Loading...</p>
    //   ) : data ? (
    //     <div
    //       style={{
    //         display: 'grid',
    //         gridTemplateColumns: '1fr 1fr 1fr 1fr',
    //         gap: 20,
    //       }}
    //     >
    //       {data.map((user) => (
    //         <div
    //           key={user.id}
    //           style={{ border: '1px solid #ccc', textAlign: 'center' }}
    //         >
    //           <img
    //             src={`https://robohash.org/${user.id}?set=set2&size=180x180`}
    //             alt={user.name}
    //             style={{ height: 180, width: 180 }}
    //           />
    //           <h3>{user.name}</h3>
    //         </div>
    //       ))}
    //     </div>
    //   ) : null}
    // </main>
  );
}
