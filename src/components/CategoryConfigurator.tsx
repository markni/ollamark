import {
  Code,
  Monitor,
  BookOpen,
  DollarSign,
  Film,
  Gamepad2,
  Coffee,
  Image as ImageIcon,
  FileText,
  ShoppingBag,
  X,
  Plus,
  CornerDownLeft,
  FileVideo,
} from "lucide-react";
import { useState } from "react";
import { useBookmarkContext } from "@/contexts/bookmark/useBookmarkContext";

const folderIcons = {
  Technology: Monitor,
  Code: Code,
  Tutorial: BookOpen,
  Finance: DollarSign,
  Entertainment: Film,
  Gaming: Gamepad2,
  Videos: FileVideo,
  Food: Coffee,
  Media: ImageIcon,
  Documents: FileText,
  Shopping: ShoppingBag,
};

export function CategoryConfigurator() {
  const { subFolders, setSubFolders } = useBookmarkContext();

  const [newFolder, setNewFolder] = useState("");
  const [isAddingFolder, setIsAddingFolder] = useState(false);

  const removeFolder = (folderToRemove: string) => {
    setSubFolders(subFolders.filter((folder) => folder !== folderToRemove));
  };

  const addFolder = () => {
    if (newFolder.trim() && !subFolders.includes(newFolder.trim())) {
      setSubFolders([...subFolders, newFolder.trim()]);
      setNewFolder("");
      setIsAddingFolder(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addFolder();
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {subFolders.map((folder) => {
        const Icon =
          folderIcons[folder as keyof typeof folderIcons] || FileText;
        return (
          <div
            key={folder}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Icon className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">{folder}</span>
            <X
              className="h-3 w-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={() => removeFolder(folder)}
            />
          </div>
        );
      })}
      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors">
        {isAddingFolder ? (
          <>
            <input
              type="text"
              value={newFolder}
              onChange={(e) => setNewFolder(e.target.value.slice(0, 30))}
              onKeyPress={handleKeyPress}
              className="w-24 bg-transparent border-none outline-none text-xs text-gray-700"
              placeholder="Category name"
              autoFocus
            />
            <CornerDownLeft
              className="h-3 w-3 text-gray-500 hover:text-gray-700 cursor-pointer"
              onClick={addFolder}
            />
          </>
        ) : (
          <Plus
            className="h-3 w-3 text-gray-500 hover:text-gray-700 cursor-pointer"
            onClick={() => setIsAddingFolder(true)}
          />
        )}
      </div>
    </div>
  );
}
