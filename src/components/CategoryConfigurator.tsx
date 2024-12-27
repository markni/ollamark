import { DEFAULT_SUBFOLDERS } from "@/constants";
import {
  Code,
  Monitor,
  BookOpen,
  DollarSign,
  Film,
  Gamepad2,
  Youtube,
  Coffee,
  Image as ImageIcon,
  FileText,
  ShoppingBag,
  X,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";

const folderIcons = {
  Technology: Monitor,
  Code: Code,
  Tutorial: BookOpen,
  Finance: DollarSign,
  Entertainment: Film,
  Gaming: Gamepad2,
  Videos: Youtube,
  Food: Coffee,
  Media: ImageIcon,
  Documents: FileText,
  Shopping: ShoppingBag,
};

export function CategoryConfigurator() {
  const [subfolders, setSubfolders] = useState(DEFAULT_SUBFOLDERS);
  const [newFolder, setNewFolder] = useState("");

  const removeFolder = (folderToRemove: string) => {
    setSubfolders(subfolders.filter((folder) => folder !== folderToRemove));
  };

  const addFolder = () => {
    if (newFolder.trim() && !subfolders.includes(newFolder.trim())) {
      setSubfolders([...subfolders, newFolder.trim()]);
      setNewFolder("");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {subfolders.map((folder) => {
        const Icon = folderIcons[folder as keyof typeof folderIcons];
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
        <Plus
          className="h-3 w-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={addFolder}
        />
      </div>
    </div>
  );
}
