'use client';

interface ButtonProps {
  text: React.ReactNode;
  type?: 'submit' | 'button';
  disabled: boolean;
}

export const Button = (props: ButtonProps) => {
  return (
    <button
      className='w-full rounded-xl bg-[#1a1916] px-4 py-3 text-sm font-semibold text-[#f9f6ef] shadow-sm transition-all duration-150 hover:bg-[#2d2c26] disabled:cursor-not-allowed disabled:opacity-60'
      type={props.type ?? 'button'}
      disabled={props.disabled}
    >
      {props.text}
    </button>
  );
};
