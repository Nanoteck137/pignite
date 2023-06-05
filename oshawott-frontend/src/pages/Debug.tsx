import Button from "../components/Button";

const DebugPage = () => {
  const sizes = ["small", "normal", "large"] as const;
  const varients = [
    "primary",
    "secondary",
    "success",
    "danger",
    "warning",
  ] as const;
  const varientStyles = ["normal", "outline", "text"] as const;

  let buttons = [];

  for (let varientStyle of varientStyles) {
    for (let varient of varients) {
      for (let size of sizes) {
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
    <div className="">
      <div className="grid place-items-center gap-4 sm:grid-cols-3">
        {buttons.map((button) => {
          const { varient, varientStyle, size, label } = button;
          return (
            <Button
              className="max-w-fit"
              varient={varient}
              varientStyle={varientStyle}
              size={size}
              key={`${varient}-${varientStyle}-${size}`}>
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
              key={`${varient}-${varientStyle}-${size}-full`}>
              {label}
            </Button>
          );
        })}
      </div>

      {/* {sizes.map((size) => { */}
      {/*   return ( */}
      {/*     <div className="flex justify-around gap-2" key={size}> */}
      {/*       {varients.map((varient) => { */}
      {/*         return ( */}
      {/*         ); */}
      {/*       })} */}
      {/*     </div> */}
      {/*   ); */}
      {/* })} */}
    </div>
  );
};

export default DebugPage;
