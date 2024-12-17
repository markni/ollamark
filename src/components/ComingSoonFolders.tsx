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
} from "lucide-react";

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

export function ComingSoonFolders() {
  return (
    <div className="flex flex-wrap gap-2">
      {DEFAULT_SUBFOLDERS.map((folder) => {
        const Icon = folderIcons[folder as keyof typeof folderIcons];
        return (
          <div
            key={folder}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
          >
            <Icon className="w-3.5 h-3.5 text-gray-600" />
            <span className="text-xs font-medium text-gray-700">{folder}</span>
          </div>
        );
      })}
    </div>
  );
}
