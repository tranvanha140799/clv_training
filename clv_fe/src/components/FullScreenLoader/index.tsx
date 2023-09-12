import Spinner from '../Spinner';

const FullScreenLoader = () => {
  return (
    <div className="w-screen h-screen fixed bg-ct-blueprint-600">
      <div className="absolute top-64 left-1/2 -translate-x-1/2">
        <Spinner width={'5rem'} height={'5rem'} />
      </div>
    </div>
  );
};

export default FullScreenLoader;
