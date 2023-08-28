import React from 'react';

type FormInputProps = {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
};

const FormInput: React.FC<FormInputProps> = ({
  label,
  name,
  type = 'text',
  placeholder = '',
}) => {
  return (
    <div className="">
      <label htmlFor={name} className="block text-ct-blueprint-600 mb-3">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="block w-full rounded-2xl appearance-none focus:outline-none py-2 px-4"
        // {...register(name)}
      />
      {/* {errors[name] && (
        <span className="text-red-500 text-xs pt-1 block">
          {errors[name]?.message as string}
        </span>
      )} */}
    </div>
  );
};

export default FormInput;
