import { BookmarkResponse } from "../types/responses";

const TEST_BOOKMARKS = [
  {
    name: "Hello-World Repository",
    url: "https://github.com/octocat/Hello-World",
  },
  {
    name: "Stranger Things Episode 1",
    url: "https://www.netflix.com/watch/70287060",
  },
  { name: "Introducing Sora", url: "https://openai.com/blog/introducing-sora" },
  {
    name: "Best Chocolate Chip Cookies Recipe",
    url: "https://www.allrecipes.com/recipe/279826/best-chocolate-chip-cookies/",
  },
  { name: "NBA Standings", url: "https://www.espn.com/nba/standings" },
  {
    name: "Prime Factorization Video",
    url: "https://www.khanacademy.org/math/pre-algebra/pre-algebra-factors-multiples/pre-algebra-prime-factorization/v/prime-factorization",
  },
  {
    name: "Echo Dot (3rd Gen) Product Page",
    url: "https://www.amazon.com/dp/B075Y66PVJ",
  },
  {
    name: "Meta’s New AI Can Generate Images in Seconds",
    url: "https://techcrunch.com/2023/03/22/meta-ai-image-generation/",
  },
  {
    name: "Artificial Intelligence Wikipedia Page",
    url: "https://en.wikipedia.org/wiki/Artificial_intelligence",
  },
  { name: "Google Spreadsheets", url: "https://docs.google.com/spreadsheets" },
  {
    name: "Left 4 Dead 2 Game Page",
    url: "https://store.steampowered.com/app/105600/Left_4_Dead_2/",
  },
  {
    name: "Apple Inc. Stock Quote (AAPL)",
    url: "https://finance.yahoo.com/quote/AAPL",
  },
  {
    name: "AlphaZero Technology",
    url: "https://deepmind.com/technology/alphazero",
  },
  {
    name: "Never Gonna Give You Up Video",
    url: "https://www.youtube.com/watch?v=dQw4w9WgX0o",
  },
  {
    name: "Alex's Ultimate Chocolate Chip Cookies Recipe",
    url: "https://www.foodnetwork.com/recipes/food-network-test-kitch/alex-s-ultimate-chocolate-chip-cookies-3554441",
  },
  { name: "NBA News and Updates", url: "https://bleacherreport.com/nba" },
  {
    name: "Machine Learning Course by Andrew Ng",
    url: "https://www.coursera.org/learn/machine-learning",
  },
  {
    name: "Vintage Vinyl Record Listing",
    url: "https://www.ebay.com/itm/324575575778",
  },
  {
    name: "AI Is Changing Everything: Here’s a Guide",
    url: "https://www.wired.com/2023/03/ai-is-changing-everything-heres-guide/",
  },
  { name: "World News Subreddit", url: "https://www.reddit.com/r/worldnews/" },
  { name: "Microsoft Word Online", url: "https://www.office.com/word" },
  { name: "Twitch Official Channel", url: "https://www.twitch.tv/twitch" },
  {
    name: "Stock Markets Overview",
    url: "https://www.bloomberg.com/markets/stocks",
  },
  {
    name: "Best Chocolate Chip Cookies Recipe by Epicurious",
    url: "https://www.epicurious.com/recipes/food/views/best-chocolate-chip-cookies-233711",
  },
  { name: "NBA Coverage and Highlights", url: "https://www.si.com/nba" },
  {
    name: "The Complete Web Development Course",
    url: "https://www.udemy.com/course/the-complete-web-development-course/",
  },
  {
    name: "Handmade Item Listing (Example)",
    url: "https://www.etsy.com/listing/123456789/some-item",
  },
  {
    name: "Meta’s AI Image Generation Goes Open Source",
    url: "https://www.theverge.com/2023/3/22/23650751/meta-ai-image-generation-open-source",
  },
  {
    name: "What is Life? Question Thread",
    url: "https://www.quora.com/What-is-life",
  },
  {
    name: "Dropbox Paper for Teams",
    url: "https://www.dropbox.com/paper/teams",
  },
  {
    name: "New PlayStation 5 Update Adds VRR Support",
    url: "https://www.ign.com/articles/2023/03/22/new-playstation-5-update-adds-vrr-support-for-120hz-gaming",
  },
  {
    name: "What is Short Selling?",
    url: "https://www.investopedia.com/articles/stocks/08/short-selling.asp",
  },
  {
    name: "The Dark Side of the Moon Album",
    url: "https://open.spotify.com/album/6DPYiy39sFLj24Xhjju4iK",
  },
  { name: "Two Sum Problem", url: "https://leetcode.com/problems/two-sum/" },
  {
    name: "Watson Products and Solutions",
    url: "https://www.ibm.com/watson/products",
  },
  {
    name: "Why Doesn't Anything Happen? Question",
    url: "https://stackoverflow.com/questions/1/why-doesnt-anything-happen",
  },
];

export const handleDebugResetBookmarks = (
  _message: unknown,
  sendResponse: (response: BookmarkResponse) => void
) => {
  console.log("Debug reset bookmarks", import.meta.env.MODE);
  // Only run in development mode
  if (import.meta.env.MODE !== "development") {
    console.warn("Debug reset bookmarks is only available in development mode");
    sendResponse({ bookmarkTree: [] });
    return true;
  }

  // Get the bookmark bar (id "1") and remove all non-folder items
  chrome.bookmarks.getChildren("1", async (bookmarks) => {
    try {
      // Filter for non-folder bookmarks
      const toRemove = bookmarks.filter((bookmark) => !bookmark.children);

      // Remove each non-folder bookmark
      await Promise.all(
        toRemove.map(
          (bookmark) =>
            new Promise((resolve) =>
              chrome.bookmarks.remove(bookmark.id, resolve)
            )
        )
      );

      // Add test bookmarks
      await Promise.all(
        TEST_BOOKMARKS.map(
          (bookmark) =>
            new Promise((resolve) =>
              chrome.bookmarks.create(
                {
                  parentId: "1",
                  title: bookmark.name,
                  url: bookmark.url,
                },
                resolve
              )
            )
        )
      );

      // Get updated tree and send response
      chrome.bookmarks.getTree((bookmarkTreeNodes) => {
        console.log("Debug: Bookmarks reset complete:", bookmarkTreeNodes);
        sendResponse({ bookmarkTree: bookmarkTreeNodes });
      });
    } catch (error) {
      console.error("Error resetting bookmarks:", error);
      sendResponse({ bookmarkTree: [] });
    }
  });

  return true;
};
