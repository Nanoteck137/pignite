import { useState } from "react";
import Button from "../components/Button";
import Input from "../components/Input";

const ButtonTest = () => {
  const sizes = ["small", "normal", "large"] as const;
  const varients = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
  ] as const;
  const varientStyles = ["normal", "outline", "text"] as const;

  const buttons = [];

  for (const varientStyle of varientStyles) {
    for (const varient of varients) {
      for (const size of sizes) {
        buttons.push({
          size,
          varient,
          varientStyle,
          label: `${varient}-${size}`,
        });
      }
    }
  }

  return (
    <div>
      <div className="grid place-items-center gap-4 sm:grid-cols-3">
        {buttons.map((button) => {
          const { varient, varientStyle, size, label } = button;
          return (
            <Button
              className="max-w-fit"
              varient={varient}
              varientStyle={varientStyle}
              size={size}
              key={`${varient}-${varientStyle}-${size}`}
            >
              {label}
            </Button>
          );
        })}
      </div>

      <div className="h-10"></div>

      <div className="grid place-items-center gap-4 sm:grid-cols-3">
        {buttons.map((button) => {
          const { varient, varientStyle, size, label } = button;
          return (
            <Button
              className="w-full"
              varient={varient}
              varientStyle={varientStyle}
              size={size}
              key={`${varient}-${varientStyle}-${size}-full`}
            >
              {label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

const InputTest = () => {
  return (
    <div>
      <div className="flex justify-around">
        <div>
          <Input type="text" />
          <div className="h-2" />
          <Input label="Label" type="text" />
        </div>

        <div>
          <Input type="text" placeholder="Placeholder" />
          <div className="h-2" />
          <Input label="Label" type="text" placeholder="Placeholder" />
        </div>
      </div>
    </div>
  );
};

type State = "button" | "input";

const DebugPage = () => {
  const [state, setState] = useState<State>("button");

  return (
    <div className="">
      <div className="bg-slate-600 py-8">
        <div className="flex justify-around">
          <Button onClick={() => setState("button")}>Buttons</Button>
          <Button onClick={() => setState("input")}>Inputs</Button>
        </div>
      </div>

      <div className="h-8" />
      {state == "button" && <ButtonTest />}
      {state == "input" && <InputTest />}
    </div>
  );
};

export default DebugPage;
