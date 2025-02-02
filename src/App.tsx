import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { BookmarksSection } from "@/components/BookmarksSection";
import { SortBookmarksSection } from "@/components/SortBookmarksSection";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { BookmarkProvider, useBookmarkContext } from "@/contexts/bookmark";

import { OllamaAccordion } from "@/components/OllamaAccordion";
import { LlmAccordion } from "@/components/LlmAccordion";
import { CreateFoldersAccordion } from "@/components/CreateFoldersAccordion";
import { StepBlueTab } from "@/components/StepBlueTab";
// import Bookshelf from "@/components/Bookshelf";
function Footer() {
  return (
    <footer className="fixed bottom-0 w-full bg-background border-t z-20">
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
  const {
    currentStep,
    rootFolderId,
    llmModel,
    isOllamaOnline,
    setCurrentStep,
  } = useBookmarkContext();

  const finalStepEnabled = isOllamaOnline && llmModel && rootFolderId;

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="grid grid-cols-[400px,1fr] min-h-screen">
            <div className="pt-40 pl-40 overflow-hidden flex flex-col gap-4 items-end">
              <StepBlueTab />
              <Button
                onClick={() => setCurrentStep(4)}
                size="xl"
                variant="destructive"
                disabled={!finalStepEnabled}
                className={`px-8 mt-20 rounded-none relative shadow-[-20px_0px_20px_-15px_rgba(0,0,0,0.3)] ${
                  finalStepEnabled
                    ? "animate-in slide-in-from-right-[90%] duration-500 translate-x-0"
                    : "translate-x-[90%]"
                }
                `}
              >
                Sort Bookmarks
                <span className="absolute left-[-29px] top-0 w-0 h-0 border-t-[0px] border-b-[37px] border-y-transparent border-r-[48px] border-r-destructive hover:bg-destructive"></span>
                <span className="absolute left-[-29px] bottom-0 w-0 h-0 border-t-[37px] border-b-[0px] border-y-transparent border-r-[48px] border-r-destructive hover:bg-destructive"></span>
              </Button>
            </div>
            <div className=" z-10">
              <div className="p-4 flex flex-col gap-4 bg-muted rounded-l-xl mt-20 h-full shadow-[-20px_0px_20px_-15px_rgba(0,0,0,0.3)]">
                <div className={currentStep === 1 ? "" : "hidden"}>
                  <OllamaAccordion />
                </div>
                <div className={currentStep === 2 ? "" : "hidden"}>
                  <LlmAccordion />
                </div>
                <div className={currentStep === 3 ? "" : "hidden"}>
                  <CreateFoldersAccordion />
                </div>
                <div className={currentStep === 4 ? "" : "hidden"}>
                  <SortBookmarksSection />
                </div>
              </div>
            </div>
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
