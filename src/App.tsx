import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { Separator } from "@/components/ui/separator";
import { BookmarksSection } from "@/components/BookmarksSection";
import { CreateFoldersSection } from "@/components/CreateFoldersSection";
import { SortBookmarksSection } from "@/components/SortBookmarksSection";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import {
  BookmarkProvider,
} from "@/contexts/bookmark";

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
            <Separator className="my-4" />

            <section>
              <CreateFoldersSection />
            </section>
            <Separator className="my-4" />

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
          <section className="p-4 ">
            <BookmarksSection />
          </section>
        </ResizablePanel>
      </ResizablePanelGroup>

      <Toaster />
    </>
  );
}

export default App;
