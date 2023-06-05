import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";
import { twJoin } from "tailwind-merge";
import Button from "./Button";

export type DropdownItem = {
  name: string;
  icon?: ReactNode;
  type?: "default" | "red";
  onClick?: () => void;
};

interface DropdownProps {
  iconSize?: string;
  items: DropdownItem[];
}

const Dropdown = (props: DropdownProps) => {
  const { iconSize, items } = props;

  return (
    <Menu className="relative" as="div">
      <Menu.Button className="flex items-center" as="div">
        <EllipsisVerticalIcon
          className={`w-${iconSize || "6"} h-${iconSize || "6"} text-white`}
        />
      </Menu.Button>
      <Menu.Items className="absolute right-1 z-50 flex min-w-max flex-col gap-2 rounded bg-slate-500 p-4 elevation-4">
        {items.map((item, i) => {
          const { type = "default" } = item;
          return (
            <Menu.Item key={i}>
              <Button
                varient={type == "red" ? "danger" : "primary"}
                className="flex w-44 items-center"
                // className={twJoin(
                //   "flex w-44 rounded px-2 py-2",
                //   item.type && item.type == "red"
                //     ? "bg-red-600 text-white"
                //     : "bg-slate-700 text-white",
                // )}
                onClick={item.onClick}>
                {item.icon && (
                  <>
                    {item.icon}
                    <div className="w-2"></div>
                  </>
                )}
                <span className="">{item.name}</span>
              </Button>
            </Menu.Item>
          );
        })}
      </Menu.Items>
    </Menu>
  );
};

export default Dropdown;
