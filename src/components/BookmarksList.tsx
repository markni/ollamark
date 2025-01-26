import { useState } from "react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { Button } from "@/components/ui/button";
import { useBookmarkContext } from "@/contexts/bookmark";
import { Loader2 } from "lucide-react";

interface BookmarksListProps {
  sortedBookmarks: Array<
    chrome.bookmarks.BookmarkTreeNode & { category?: string }
  >;
  onCategoryChange: (bookmarkId: string, newCategory: string) => void;
  onReset: () => void;
}

export function BookmarksList({
  sortedBookmarks,
  onCategoryChange,
  onReset,
}: BookmarksListProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 20;
  const { subFolders } = useBookmarkContext();

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedBookmarks.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <>
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={onReset} className="mb-2">
          Reset Categories
        </Button>
      </div>
      <Table>
        <TableCaption>Review and adjust the categorized bookmarks</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Bookmark</TableHead>
            <TableHead className="text-right">Category</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentPageItems().map((bookmark) => (
            <TableRow key={bookmark.id} className="h-[72px]">
              <TableCell>
                <div className="text-md">{bookmark.title}</div>
                <a
                  href={bookmark.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-500 hover:text-blue-700 hover:underline truncate block max-w-[500px]"
                >
                  {bookmark.url}
                </a>
              </TableCell>
              <TableCell className="text-right">
                {bookmark.category ? (
                  <select
                    value={bookmark.category}
                    onChange={(e) =>
                      onCategoryChange(bookmark.id, e.target.value)
                    }
                    className="px-2 py-1 bg-secondary rounded text-sm border-0"
                  >
                    {subFolders.map((folderName) => (
                      <option key={folderName} value={folderName}>
                        {folderName}
                      </option>
                    ))}
                  </select>
                ) : (
                  <Loader2 className="h-4 w-4 animate-spin ml-auto" />
                )}
              </TableCell>
            </TableRow>
          ))}
          {Array.from({
            length: Math.max(0, ITEMS_PER_PAGE - getCurrentPageItems().length),
          }).map((_, index) => (
            <TableRow key={`empty-${index}`} className="h-[72px]">
              <TableCell />
              <TableCell />
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem className="cursor-pointer">
            {currentPage > 1 ? (
              <PaginationPrevious
                onClick={() => handlePageChange(currentPage - 1)}
              />
            ) : (
              <PaginationPrevious className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>

          {Array.from({
            length: Math.ceil(sortedBookmarks.length / ITEMS_PER_PAGE),
          }).map((_, index) => (
            <PaginationItem className="cursor-pointer" key={index + 1}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem className="cursor-pointer">
            {currentPage <
            Math.ceil(sortedBookmarks.length / ITEMS_PER_PAGE) ? (
              <PaginationNext
                onClick={() => handlePageChange(currentPage + 1)}
              />
            ) : (
              <PaginationNext className="pointer-events-none opacity-50" />
            )}
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </>
  );
}
