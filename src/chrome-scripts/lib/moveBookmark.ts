export default async function moveBookmark(
  bookmarkId: string,
  rootFolderId: string,
  targetCategoryName: string
) {
  // Get all children of the root folder
  const children = await chrome.bookmarks.getChildren(rootFolderId);

  // Find the target category folder
  const targetFolder = children.find(
    (folder) => folder.title === targetCategoryName
  );

  if (targetFolder) {
    // Move bookmark to the target category folder
    await chrome.bookmarks.move(bookmarkId, { parentId: targetFolder.id });
  } else {
    throw new Error(
      `Category folder "${targetCategoryName}" not found in root folder`
    );
  }
}
