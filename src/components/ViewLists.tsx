import { useQuery } from "@tanstack/react-query";
import ListItem from "./ListItem";
import { fetchLists } from "../api/fetch";

type ViewListsProps = {
  onListItemClicked?: (listId: number) => void;
};

function useLists() {
  return useQuery({
    queryKey: ["lists"],
    queryFn: fetchLists,
  });
}

const ViewLists = ({ onListItemClicked }: ViewListsProps) => {
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
            onClick={() => onListItemClicked && onListItemClicked(item.id)}
          />
        );
      })}
    </div>
  );
};

export default ViewLists;
