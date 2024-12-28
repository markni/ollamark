import { useState } from "react";
import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryConfigurator } from "./CategoryConfigurator";
import { toast } from "sonner";
import { useBookmarkContext } from "@/contexts/bookmark";

export function CreateFoldersSection() {
  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { setOpenFolders } = useBookmarkContext();

  const createFolders = () => {
    setIsCreatingFolders(true);
    chrome.runtime.sendMessage(
      { action: "createFolders", folderName },
      (response) => {
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
      }
    );
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-16 items-center">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <Input
          type="text"
          placeholder="Root folder name"
          value={folderName}
          onChange={(e) => setFolderName(e.target.value)}
        />
        <Button onClick={createFolders} disabled={isCreatingFolders}>
          <FolderPlus
            className={`mr-2 h-4 w-4 ${
              isCreatingFolders ? "animate-spin" : ""
            }`}
          />
          Create
        </Button>
      </div>
      <CategoryConfigurator />
    </div>
  );
}
