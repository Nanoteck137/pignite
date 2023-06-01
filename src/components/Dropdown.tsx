import { Menu } from "@headlessui/react";
import { EllipsisVerticalIcon } from "@heroicons/react/20/solid";
import { ReactNode } from "react";

export type DropdownItem = {
  name: string;
  icon?: ReactNode;
  type?: "default" | "red";
  onClick?: () => void;
};

interface DropdownProps {
  items: DropdownItem[];
}

const Dropdown = (props: DropdownProps) => {
  const { items } = props;

  return (
    <Menu className="relative" as="div">
      <Menu.Button className="flex items-center" as="div">
        <EllipsisVerticalIcon className="w-6 h-6 text-white" />
      </Menu.Button>
      <Menu.Items className="flex flex-col gap-2 absolute right-1 min-w-max z-50 rounded bg-slate-500 elevation-4 p-2">
        {items.map((item, i) => {
          let itemColor = "bg-slate-700 hover:bg-gray-600";
          if (item.type && item.type == "red") {
            itemColor = "bg-red-600 hover:bg-red-500";
          }

          return (
            <Menu.Item key={i}>
              <button
                className={`flex px-3 py-2 rounded w-44 ${itemColor} text-white`}
                onClick={item.onClick}>
                {item.icon && (
                  <>
                    {item.icon}
                    <div className="w-2"></div>
                  </>
                )}
                <span className="">{item.name}</span>
              </button>
            </Menu.Item>
          );
        })}

        {/* <Menu.Item> */}
        {/*   <div className="flex px-2 py-1 rounded bg-purple-400 text-white"> */}
        {/*     <PencilSquareIcon className="w-6 h-6" /> */}
        {/*     <button className="flex-grow">Edit</button> */}
        {/*   </div> */}
        {/* </Menu.Item> */}
        {/* <Menu.Item> */}
        {/*   <div className="flex px-2 py-1 rounded bg-red-400 text-white"> */}
        {/*     <TrashIcon className="w-6 h-6" /> */}
        {/*     <div className="w-2"></div> */}
        {/*     <button className="">Delete</button> */}
        {/*   </div> */}
        {/* </Menu.Item> */}
      </Menu.Items>
    </Menu>
  );
};

export default Dropdown;
