import { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useBookmarkContext } from "@/contexts/bookmark";
import { SortBookmarksResponse } from "@/chrome-scripts/types/responses";

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

export function SortBookmarksSection() {
  const [isSorting, setIsSorting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;
  const [originalSortedBookmarks, setOriginalSortedBookmarks] = useState<
    Array<chrome.bookmarks.BookmarkTreeNode & { category: string }>
  >([]);
  const [sortedBookmarks, setSortedBookmarks] = useState<
    Array<chrome.bookmarks.BookmarkTreeNode & { category: string }>
  >([]);
  const { isOllamaOnline, llmModel, rootFolderId, subFolders } =
    useBookmarkContext();

  const sortBookmarks = () => {
    setIsSorting(true);
    setSortedBookmarks([]);
    setOriginalSortedBookmarks([]);
    chrome.runtime.sendMessage(
      { action: "sortBookmarks", llmModel },
      (response: SortBookmarksResponse) => {
        if (response.success && response.categorizedBookmarks) {
          setOriginalSortedBookmarks(response.categorizedBookmarks);
          setSortedBookmarks(response.categorizedBookmarks);
          toast(
            "Bookmarks pre-sorted successfully, please review the results",
            {
              action: {
                label: "Reset Categories",
                onClick: () => setSortedBookmarks(originalSortedBookmarks),
              },
            }
          );
        } else {
          console.error("Failed to sort bookmarks:", response.error);
          toast.error("Failed to sort bookmarks");
        }
        setTimeout(() => {
          setIsSorting(false);
        }, 500);
      }
    );
  };

  const handleCategoryChange = (bookmarkId: string, newCategory: string) => {
    setSortedBookmarks((bookmarks) =>
      bookmarks.map((bookmark) =>
        bookmark.id === bookmarkId
          ? { ...bookmark, category: newCategory }
          : bookmark
      )
    );
  };

  const handleReset = () => {
    setSortedBookmarks(originalSortedBookmarks);
    toast.success("Categories reset to original suggestions");
  };

  const getCurrentPageItems = () => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return sortedBookmarks.slice(startIndex, endIndex);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="mb-8 p-4 border rounded-lg bg-muted flex flex-col gap-4">
      {sortedBookmarks.length > 0 ? (
        <>
          <div className="flex justify-end">
            <Button
              variant="outline"
              size="sm"
              onClick={handleReset}
              className="mb-2"
            >
              Reset Categories
            </Button>
          </div>
          <Table>
            <TableCaption>
              Review and adjust the categorized bookmarks
            </TableCaption>
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
                    <select
                      value={bookmark.category}
                      onChange={(e) =>
                        handleCategoryChange(bookmark.id, e.target.value)
                      }
                      className="px-2 py-1 bg-secondary rounded text-sm border-0"
                    >
                      {subFolders.map((folderName) => (
                        <option key={folderName} value={folderName}>
                          {folderName}
                        </option>
                      ))}
                    </select>
                  </TableCell>
                </TableRow>
              ))}
              {/* Add empty rows to maintain consistent height */}
              {Array.from({
                length: Math.max(
                  0,
                  ITEMS_PER_PAGE - getCurrentPageItems().length
                ),
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

          <div className="flex justify-center gap-4">
            <Button
              onClick={sortBookmarks}
              disabled={
                isSorting || !isOllamaOnline || !llmModel || !rootFolderId
              }
              className="w-full sm:w-auto"
            >
              <ArrowUpDown
                className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
              />
              Resort Bookmarks
            </Button>
            <Button className="w-full sm:w-auto" disabled={isSorting}>
              Confirm Categories
            </Button>
          </div>
        </>
      ) : (
        <div className="flex justify-center">
          <Button
            onClick={sortBookmarks}
            disabled={
              isSorting || !isOllamaOnline || !llmModel || !rootFolderId
            }
            className="w-full sm:w-auto"
          >
            <ArrowUpDown
              className={`mr-2 h-4 w-4 ${isSorting ? "animate-spin" : ""}`}
            />
            Sort Bookmarks
          </Button>
        </div>
      )}
    </div>
  );
}
