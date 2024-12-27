import * as React from "react";
import { ChevronRight, Globe, Folder } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TreeViewProps {
  data: chrome.bookmarks.BookmarkTreeNode[];
  openFolders?: string[];
}

export function FileTree({ data, openFolders }: TreeViewProps) {
  return <TreeView items={data} openFolders={openFolders} />;
}

function TreeView({
  items,
  openFolders,
}: {
  items: chrome.bookmarks.BookmarkTreeNode[];
  openFolders?: string[];
}) {
  // Convert openFolders into a Set for O(1) lookup.
  const openFoldersSet = React.useMemo(
    () => new Set(openFolders ?? []),
    [openFolders]
  );

  /**
   * Recursively checks if the provided node or any of its descendants
   * is in the openFolders set.
   */
  const isNodeOpen = React.useCallback(
    function isNodeOpen(node: chrome.bookmarks.BookmarkTreeNode): boolean {
      if (openFoldersSet.has(node.id)) return true;
      return node.children?.some(isNodeOpen) ?? false;
    },
    [openFoldersSet]
  );

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <TreeItem key={item.id} item={item} isNodeOpen={isNodeOpen} />
      ))}
    </ul>
  );
}

function TreeItem({
  item,
  isNodeOpen,
}: {
  item: chrome.bookmarks.BookmarkTreeNode;
  isNodeOpen: (node: chrome.bookmarks.BookmarkTreeNode) => boolean;
}) {
  // Initialize state based on whether this node (or a descendant) is open.
  const [isOpen, setIsOpen] = React.useState(() => isNodeOpen(item));

  // Update whenever openFolders change.
  React.useEffect(() => {
    setIsOpen(isNodeOpen(item));
  }, [isNodeOpen, item]);

  const isFolder = !!item.children;
  const toggleOpen = React.useCallback(() => setIsOpen((prev) => !prev), []);

  if (isFolder) {
    return (
      <li>
        <Button
          variant="ghost"
          className="w-full justify-start p-2"
          onClick={toggleOpen}
        >
          <ChevronRight
            className={`h-4 w-4 shrink-0 transition-transform duration-200 ${
              isOpen ? "rotate-90" : ""
            }`}
          />
          <Folder
            className={`mr-2 h-4 w-4 shrink-0 ${
              isOpen ? "text-blue-500" : "text-gray-500"
            }`}
          />
          <span className="flex-grow text-left">{item.title}</span>
        </Button>
        {isOpen && item.children && item.children.length > 0 && (
          <ul className="ml-6 mt-1 space-y-1">
            {item.children.map((child) => (
              <TreeItem key={child.id} item={child} isNodeOpen={isNodeOpen} />
            ))}
          </ul>
        )}
      </li>
    );
  }

  // Bookmark link
  return (
    <li>
      <Button
        variant="ghost"
        className="w-full justify-start p-2"
        onClick={() => item.url && window.open(item.url, "_blank")}
      >
        <Globe className="mr-2 h-4 w-4 shrink-0 text-gray-500" />
        <span className="flex-grow text-left">{item.title}</span>
      </Button>
    </li>
  );
}
