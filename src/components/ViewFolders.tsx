import FolderItem from "./FolderItem";

type ViewFoldersProps = {
  onFolderClick?: (folderId: number) => void;
};

const ViewFolders = ({ onFolderClick }: ViewFoldersProps) => {
  const arr = new Array(100).fill(0).map(() => {
    const num = Math.floor(Math.random() * 100);
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const data = new Array(num)
      .fill(0)
      .map(() => chars.charAt(Math.floor(Math.random() * chars.length)))
      .join("");

    return `Folder ${data}`;
  });

  return (
    <div className="flex flex-col gap-2">
      {arr.map((item, i) => {
        return (
          <FolderItem
            key={i}
            name={item}
            onClick={() => onFolderClick && onFolderClick(i)}
          />
        );
      })}
    </div>
  );
};

export default ViewFolders;
