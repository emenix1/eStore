import type { ButtonHTMLAttributes, FC } from "react";

export const SortButton: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
  return (
    <button {...props} className="text-black px-2 py-1 inline-flex rounded-md cursor-pointer hover:bg-gray-300">
      {children}
    </button>
  );
};
