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
  // Convert openFolders into a Set for O(1) lookup
  const openFoldersSet = React.useMemo(
    () => new Set(openFolders ?? []),
    [openFolders]
  );

  /**
   * Checks if the current node or any of its children are in the openFolders set
   */
  const isNodeOpen = React.useCallback(
    (node: chrome.bookmarks.BookmarkTreeNode): boolean => {
      // If the current node is in openFolders, return true
      if (openFoldersSet.has(node.id)) {
        return true;
      }

      // If any child node is in openFolders, this node should be open
      if (node.children) {
        return node.children.some((child) => {
          // Recursively check if any descendant is in openFolders
          if (openFoldersSet.has(child.id)) {
            return true;
          }
          return child.children ? isNodeOpen(child) : false;
        });
      }

      return false;
    },
    [openFoldersSet]
  );

  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <TreeItem
          key={item.id}
          item={item}
          isNodeOpen={isNodeOpen}
          defaultOpen={isNodeOpen(item)} // Pass initial open state
        />
      ))}
    </ul>
  );
}

function TreeItem({
  item,
  isNodeOpen,
  defaultOpen, // Add defaultOpen prop
}: {
  item: chrome.bookmarks.BookmarkTreeNode;
  isNodeOpen: (node: chrome.bookmarks.BookmarkTreeNode) => boolean;
  defaultOpen: boolean;
}) {
  // Initialize state based on defaultOpen prop
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  // Only update when the direct node's open state changes in openFolders
  React.useEffect(() => {
    const newIsOpen = isNodeOpen(item);
    if (newIsOpen) {
      setIsOpen(true);
    }
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
          <span className="flex-grow text-left truncate" title={item.title}>
            {item.title}
          </span>
        </Button>
        {isOpen && item.children && item.children.length > 0 && (
          <ul className="ml-6 mt-1 space-y-1">
            {item.children.map((child) => (
              <TreeItem
                key={child.id}
                item={child}
                isNodeOpen={isNodeOpen}
                defaultOpen={isNodeOpen(child)}
              />
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
        <span className="flex-grow text-left truncate" title={item.title}>
          {item.title}
        </span>
      </Button>
    </li>
  );
}
