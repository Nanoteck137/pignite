import { useQuery } from "@tanstack/react-query";
import ListItem from "./ListItem";
import { fetchLists } from "../api/fetch";

type ViewListsProps = {
  onFolderClick?: (folderId: number) => void;
};

function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: fetchLists,
  });
}

const ViewLists = ({ onFolderClick }: ViewListsProps) => {
  const { data, isError, isLoading } = useLists();

  if (isError) return <p>Error</p>;
  if (isLoading) return <p>Loading...</p>;

  return (
    <div className="flex flex-col gap-2">
      {data.map((item) => {
        return (
          <ListItem
            key={item.id}
            name={item.name}
            onClick={() => onFolderClick && onFolderClick(item.id)}
          />
        );
      })}
    </div>
  );
};

export default ViewLists;
