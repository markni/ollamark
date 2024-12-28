import { useState } from "react";
import { ArrowUpDown, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { SiOllama } from "@icons-pack/react-simple-icons";
import { useBookmarkContext } from "@/contexts/bookmark";

export function SortBookmarksSection() {
  const [isSorting, setIsSorting] = useState(false);
  const { isOllamaOnline } = useBookmarkContext();

  const sortBookmarks = () => {
    setIsSorting(true);
    chrome.runtime.sendMessage({ action: "sortBookmarks" }, (response) => {
      if (response.success) {
        toast("Bookmarks sorted successfully", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      } else {
        console.error("Failed to sort bookmarks:", response.error);
        toast.error("Failed to sort bookmarks");
      }
      setTimeout(() => {
        setIsSorting(false);
      }, 500);
    });
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4 items-center">
      <div>
        <Button
          onClick={sortBookmarks}
          disabled={isSorting || !isOllamaOnline}
          className="w-full sm:w-auto"
        >
          <ArrowUpDown
            className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
          />
          Sort Bookmarks
        </Button>
      </div>
      <div className="flex items-center gap-2">
        <SiOllama />
        <span>Ollama is {isOllamaOnline ? "online" : "offline"}</span>
        {isOllamaOnline ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <X className="h-4 w-4 text-red-500" />
        )}
      </div>

      <p className="text-sm text-muted-foreground mt-2">
        Sort your bookmarks into categories using llm.
      </p>
    </div>
  );
}
