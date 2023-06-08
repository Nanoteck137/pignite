/* eslint-disable react/display-name */
import { ComponentPropsWithoutRef, forwardRef } from "react";

type InputProps = {
  label?: string;
  type: "text" | "password";
} & ComponentPropsWithoutRef<"input">;

const Input = forwardRef<HTMLInputElement, InputProps>((props, ref) => {
  const { label, ...rest } = props;

  return (
    <div className="flex flex-col">
      {label && (
        <>
          <label className="pl-2 text-sm font-medium text-gray-300">
            {label}
          </label>
          <div className="h-1" />
        </>
      )}

      <input
        {...rest}
        className="rounded border border-slate-500 bg-slate-600 px-2 py-1 text-white placeholder:text-gray-200 focus:border-purple-300 focus:ring-purple-400"
        ref={ref}
      />
    </div>
  );
});
export default Input;
