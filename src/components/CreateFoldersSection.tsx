import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ComingSoonFolders } from "./ComingSoonFolders";
import { toast } from "sonner";
import { useBookmarkContext } from "@/contexts/BookmarkContext";

export function CreateFoldersSection() {
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const { setOpenFolders } = useBookmarkContext();

  const createFolders = () => {
    setIsCreatingFolders(true);
    chrome.runtime.sendMessage({ action: "createFolders" }, (response) => {
      if (response.success) {
        console.log(
          "Folders created successfully, the id is:",
          response.folderId
        );
        setOpenFolders([response.folderId]);
        toast("All Folders created successfully", {
          action: {
            label: "OK",
            onClick: () => console.log("Undo"),
          },
        });
      } else {
        console.error("Failed to create folders:", response.error);
      }
      setTimeout(() => {
        setIsCreatingFolders(false);
      }, 500);
    });
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4 items-center">
      <div>
        <Button
          onClick={createFolders}
          disabled={isCreatingFolders}
          className="w-full sm:w-auto"
        >
          <FolderPlus
            className={`mr-2 h-4 w-4 ${
              isCreatingFolders ? "animate-spin" : ""
            }`}
          />
          Create Category Folders
        </Button>
      </div>
      <ComingSoonFolders />
      <p className="text-sm text-muted-foreground mt-2">
        Coming soon: allow you to customize the categories.
      </p>
    </div>
  );
}
