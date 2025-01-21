import { useState } from "react";
import { Check, X, Folder } from "lucide-react";
import { useBookmarkContext } from "@/contexts/bookmark";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion,
} from "@/components/ui/accordion";

import { FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CategoryConfigurator } from "./CategoryConfigurator";
import { toast } from "sonner";

export function CreateFoldersAccordion() {
  const [accordionValue, setAccordionValue] = useState<string[]>([]);

  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [folderName, setFolderName] = useState("");
  const { setOpenFolders, setRootFolderId, subFolders, rootFolderId } =
    useBookmarkContext();

  const createFolders = () => {
    setIsCreatingFolders(true);
    chrome.runtime.sendMessage(
      {
        action: "createFolders",
        folderName,
        subfolders: subFolders,
      },
      (response) => {
        if (response.success) {
          console.log(
            "Folders created successfully, the id is:",
            response.folderId
          );
          setOpenFolders([response.folderId]);
          setRootFolderId(response.folderId);
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
    <Accordion
      type="multiple"
      value={rootFolderId ? accordionValue : ["step-1"]}
      onValueChange={(value) => {
        if (rootFolderId) {
          setAccordionValue(value);
        }
      }}
    >
      <AccordionItem value="step-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2">
            <Folder />
            3. Setup categories
            {rootFolderId ? (
              <Check className="h-4 w-4 text-green-500 ml-2" />
            ) : (
              <X className="h-4 w-4 text-red-500 ml-2" />
            )}
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
          {rootFolderId ? (
            <div className="flex items-center gap-4 mb-8 p-4 border rounded-lg bg-muted flex-col">
              You have selected {rootFolderId} as your root folder.
            </div>
          ) : (
            <div>
              Let's create your folders first, your bookmarks will be sorted
              into these categories inside the root folder.
            </div>
          )}

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
          <p>
            You can also customize the categories your bookmark will be sort
            into.
          </p>
          <CategoryConfigurator />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
