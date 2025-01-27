import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { BookmarksSection } from "@/components/BookmarksSection";
import { SortBookmarksSection } from "@/components/SortBookmarksSection";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { BookmarkProvider } from "@/contexts/bookmark";

import { OllamaAccordion } from "@/components/OllamaAccordion";
import { LlmAccordion } from "@/components/LlmAccordion";
import { CreateFoldersAccordion } from "@/components/CreateFoldersAccordion";
import Bookshelf from "@/components/Bookshelf";

function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-background border-t">
      <div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
        <p>© 2024 Bookmark Manager. Made with ♥️</p>
      </div>
    </footer>
  );
}

function App() {
  return (
    <BookmarkProvider>
      <AppContent />
    </BookmarkProvider>
  );
}

// New component to use the context
function AppContent() {
  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="container mx-auto p-4 flex flex-col gap-4">
            {/* <h1 className="text-4xl text-center my-16">
              Let's clean up your messy bookmarks!
            </h1> */}
            <Bookshelf className="mx-auto w-[500px]" />
            <OllamaAccordion />
            <LlmAccordion />
            <CreateFoldersAccordion />

            <section>
              <SortBookmarksSection />
            </section>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel
          defaultSize={15}
          style={{ background: `hsl(var(--sidebar-background))` }}
          className="min-h-screen"
        >
          <section className="p-4 overflow-auto">
            <BookmarksSection />
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Footer />

      <Toaster />
    </>
  );
}

export default App;
