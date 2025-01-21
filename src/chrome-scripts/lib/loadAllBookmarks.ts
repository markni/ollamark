export default async function loadAllBookmarks(): Promise<
  chrome.bookmarks.BookmarkTreeNode[]
> {
  console.log("Loading all bookmarks from bookmark bar");

  const tree = await chrome.bookmarks.getTree();
  // Find bookmark bar by checking title "Bookmarks bar"
  const bookmarkBar = tree[0].children?.find(
    (node) => node.title === "Bookmarks bar"
  );
  console.log("Bookmark bar:", bookmarkBar);

  if (!bookmarkBar?.children) {
    return [];
  }

  // Filter out folders and return only bookmarks
  return bookmarkBar.children.filter((node) => !node.children);
}
