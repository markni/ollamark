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
import TypewriterText from "@/components/TypewriterText";
import { Label } from "@/components/ui/label";

export function CreateFoldersAccordion() {
  const [accordionValue, setAccordionValue] = useState<string[]>([]);

  const [isCreatingFolders, setIsCreatingFolders] = useState(false);
  const [folderName, setFolderName] = useState("Sorted Bookmarks");
  const {
    setOpenFolders,
    setRootFolderId,
    subFolders,
    rootFolderId,

    rootFolderName,
    setRootFolderName,
  } = useBookmarkContext();
  const [isTypingFinished, setIsTypingFinished] = useState(false);

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
          setRootFolderName(response.folderName);
          toast.success("All Folders created successfully", {
            action: {
              label: "OK",
              onClick: () => toast.dismiss(),
            },
            position: "bottom-left",
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
      value={rootFolderId && isTypingFinished ? accordionValue : ["step-1"]}
      onValueChange={(value) => {
        if (rootFolderId) {
          setAccordionValue(value);
        }
      }}
    >
      <AccordionItem value="step-1">
        <AccordionTrigger>
          <div className="flex items-center gap-2 text-md">
            <Folder />
            <TypewriterText onTypingFinish={() => setIsTypingFinished(true)}>
              3. Setup categories
              {rootFolderName ? ` (created folder "${rootFolderName}")` : ""}
            </TypewriterText>
            {isTypingFinished &&
              (rootFolderId ? (
                <Check className="h-4 w-4 text-green-500 ml-2" />
              ) : (
                <X className="h-4 w-4 text-red-500 ml-2" />
              ))}
          </div>
        </AccordionTrigger>
        <AccordionContent className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
          {rootFolderId ? (
            <p>You have selected {rootFolderId} as your root folder.</p>
          ) : (
            <p>
              Let's create your category folders first, your bookmarks will be
              sorted into these categories inside the root folder.
            </p>
          )}

          <div className="flex w-full max-w-sm space-x-2 mt-4">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="rootFolderName" className="text-xs ">
                Root folder name
              </Label>
              <div className="flex space-x-2">
                <Input
                  id="rootFolderName"
                  type="text"
                  placeholder="Root folder name"
                  value={folderName}
                  onChange={(e) => setFolderName(e.target.value)}
                />
                <Button
                  className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                  onClick={createFolders}
                  disabled={isCreatingFolders}
                >
                  <FolderPlus
                    className={`mr-2 h-4 w-4 ${
                      isCreatingFolders ? "animate-spin" : ""
                    }`}
                  />
                  Create root folder
                </Button>
              </div>
            </div>
          </div>

          <p className="mt-4">
            You can also customize the categories your bookmark will be sort
            into.
          </p>
          <CategoryConfigurator />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
