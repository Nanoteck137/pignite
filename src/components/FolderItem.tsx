import { ChevronRightIcon } from "@heroicons/react/20/solid";

type FolderItemProps = {
  name: string;
  onClick?: () => void;
};

const FolderItem = ({ name, onClick }: FolderItemProps) => {
  // TODO(patrik): Remove truncation
  return (
    <button
      className="flex items-center justify-between rounded bg-blue-500"
      onClick={onClick}>
      <span className="text-left max-w-[75%] truncate text-lg ml-4">
        {name}
      </span>
      <ChevronRightIcon className="w-12 h-12" />
    </button>
  );
};

export default FolderItem;
