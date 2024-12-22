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
  return (
    <ul className="space-y-1">
      {items.map((item) => (
        <TreeItem key={item.id} item={item} openFolders={openFolders} />
      ))}
    </ul>
  );
}

function TreeItem({
  item,
  openFolders,
}: {
  item: chrome.bookmarks.BookmarkTreeNode;
  openFolders?: string[];
}) {
  const [isOpen, setIsOpen] = React.useState(() => {
    if (!openFolders) return false;

    const shouldBeOpen =
      openFolders.includes(item.id) ||
      (item.children?.some((child) => {
        const hasOpenDescendant = (
          node: chrome.bookmarks.BookmarkTreeNode
        ): boolean => {
          if (openFolders.includes(node.id)) return true;
          return node.children?.some(hasOpenDescendant) ?? false;
        };
        return hasOpenDescendant(child);
      }) ??
        false);

    return shouldBeOpen;
  });

  React.useEffect(() => {
    if (!openFolders) {
      setIsOpen(false);
      return;
    }

    const shouldBeOpen =
      openFolders.includes(item.id) ||
      (item.children?.some((child) => {
        const hasOpenDescendant = (
          node: chrome.bookmarks.BookmarkTreeNode
        ): boolean => {
          if (openFolders.includes(node.id)) return true;
          return node.children?.some(hasOpenDescendant) ?? false;
        };
        return hasOpenDescendant(child);
      }) ??
        false);

    setIsOpen(shouldBeOpen);
  }, [openFolders, item]);

  const isFolder = !!item.children;
  const toggleOpen = () => setIsOpen(!isOpen);

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
              <TreeItem key={child.id} item={child} openFolders={openFolders} />
            ))}
          </ul>
        )}
      </li>
    );
  }

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
