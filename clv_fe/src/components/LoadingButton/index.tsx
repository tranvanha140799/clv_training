import React from 'react';
import { Spinner } from '..';

type LoadingButtonProps = {
  loading: boolean;
  btnColor?: string;
  textColor?: string;
  disabled?: boolean;
  children: React.ReactNode;
};

export const LoadingButton: React.FC<LoadingButtonProps> = ({
  textColor = 'text-white',
  btnColor = 'bg-ct-blueprint-600',
  children,
  loading = false,
  disabled = false,
}) => {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`w-full py-3 font-semibold ${btnColor} rounded-lg outline-none border-none flex justify-center ${
        loading ? 'bg-[#ccc]' : disabled ? 'cursor-not-allowed' : ''
      }`}
    >
      {loading ? (
        <div className="flex items-center gap-3">
          <Spinner />
          <span className="text-slate-500 inline-block">Loading...</span>
        </div>
      ) : (
        <span className={`${textColor}`}>{children}</span>
      )}
    </button>
  );
};
