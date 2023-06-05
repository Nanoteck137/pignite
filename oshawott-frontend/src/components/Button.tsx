import { ComponentPropsWithoutRef, PropsWithChildren, forwardRef } from "react";
import { twMerge } from "tailwind-merge";

const varients = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
] as const;
type Varient = (typeof varients)[number];

const varientStyles = ["normal", "outline", "text"] as const;
type VarientStyle = (typeof varientStyles)[number];

const sizes = ["small", "normal", "large"] as const;
type Size = (typeof sizes)[number];

type VarientMap = Record<Varient, string>;

const VARIENT_NORMAL_MAP: VarientMap = {
  ["primary"]: "bg-purple-400 hover:bg-purple-300 text-black",
  ["secondary"]: "bg-slate-400 hover:bg-slate-300 text-black",
  ["success"]: "bg-green-400 hover:bg-green-300 text-black",
  ["danger"]: "bg-red-400 hover:bg-red-300 text-black",
  ["warning"]: "bg-yellow-400 hover:bg-yellow-300 text-black",
};

const VARIENT_OUTLINE_MAP: VarientMap = {
  ["primary"]:
    "bg-transparent border border-purple-400 text-purple-400 hover:bg-purple-400 hover:border-transparent hover:text-black",
  ["secondary"]:
    "bg-transparent border border-slate-400 text-slate-400 hover:bg-slate-400 hover:border-transparent hover:text-black",
  ["success"]:
    "bg-transparent border border-green-400 text-green-400 hover:bg-green-400 hover:border-transparent hover:text-black",
  ["danger"]:
    "bg-transparent border border-red-400 text-red-400 hover:bg-red-400 hover:border-transparent hover:text-black",
  ["warning"]:
    "bg-transparent border border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:border-transparent hover:text-black",
};

const VARIENT_TEXT_MAP: VarientMap = {
  ["primary"]:
    "bg-transparent text-purple-400 hover:bg-purple-400 hover:text-black",
  ["secondary"]:
    "bg-transparent text-slate-200 hover:bg-slate-400 hover:text-black",
  ["success"]:
    "bg-transparent text-green-400 hover:bg-green-400 hover:text-black",
  ["danger"]: "bg-transparent text-red-400 hover:bg-red-400 hover:text-black",
  ["warning"]:
    "bg-transparent text-yellow-400 hover:bg-yellow-400 hover:text-black",
};

const VARIENT_STYLE_MAP: Record<VarientStyle, VarientMap> = {
  ["normal"]: VARIENT_NORMAL_MAP,
  ["outline"]: VARIENT_OUTLINE_MAP,
  ["text"]: VARIENT_TEXT_MAP,
};

const SIZE_MAP: Record<Size, string> = {
  ["small"]: "px-2 py-0.5 text-sm",
  ["normal"]: "px-4 py-1 text-md",
  ["large"]: "px-6 py-2 text-lg",
};

type ButtonOptions = {
  varient?: Varient;
  varientStyle?: VarientStyle;
  size?: Size;
};

type ButtonProps = ComponentPropsWithoutRef<"button"> &
  PropsWithChildren<ButtonOptions>;

const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => {
  const {
    children,
    varient = "primary",
    varientStyle = "normal",
    size = "normal",
    className,
    ...rest
  } = props;

  return (
    <button
      className={twMerge(
        "rounded",
        VARIENT_STYLE_MAP[varientStyle][varient],
        SIZE_MAP[size],
        className,
      )}
      ref={ref}
      {...rest}>
      {children}
    </button>
  );
});

export default Button;
