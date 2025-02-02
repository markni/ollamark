import "./App.css";
import { Toaster } from "@/components/ui/sonner";
import { BookmarksSection } from "@/components/BookmarksSection";
import { SortBookmarksSection } from "@/components/SortBookmarksSection";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { BookmarkProvider, useBookmarkContext } from "@/contexts/bookmark";

import { OllamaAccordion } from "@/components/OllamaAccordion";
import { LlmAccordion } from "@/components/LlmAccordion";
import { CreateFoldersAccordion } from "@/components/CreateFoldersAccordion";
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
    setCurrentStep,
    isOllamaOnline,
    llmModel,
    rootFolderId,
  } = useBookmarkContext();

  // Step availability conditions
  const canAccessStep2 = isOllamaOnline;
  const canAccessStep3 = isOllamaOnline && llmModel;

  // Common class names
  const baseClasses = "transition-all";
  const enabledClasses = "hover:font-bold cursor-pointer";
  const disabledClasses = "opacity-50 cursor-not-allowed";

  return (
    <>
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel>
          <div className="grid grid-cols-[400px,1fr] min-h-screen">
            <div className="pt-40 pl-40 overflow-hidden">
              <div className="bg-blue-600 text-2xl p-4 rounded-l-xl  animate-in slide-in-from-right-1/2 duration-500 relative shadow-[-20px_0px_20px_-15px_rgba(0,0,0,0.3)] ">
                <ol className="list-decimal list-inside flex flex-col gap-6">
                  <li
                    className={`${baseClasses} ${
                      currentStep === 1 ? "font-bold" : "font-normal text-xl"
                    } ${enabledClasses} ${
                      isOllamaOnline ? "line-through" : ""
                    }`}
                    onClick={() => setCurrentStep(1)}
                  >
                    Spin up Ollama
                  </li>
                  <li
                    className={`${baseClasses} ${
                      currentStep === 2 ? "font-bold" : "font-normal  text-xl"
                    } ${canAccessStep2 ? enabledClasses : disabledClasses} ${
                      llmModel ? "line-through" : ""
                    }`}
                    onClick={() => canAccessStep2 && setCurrentStep(2)}
                  >
                    Select a model
                  </li>
                  <li
                    className={`${baseClasses} ${
                      currentStep === 3 ? "font-bold" : "font-normal  text-xl"
                    } ${canAccessStep3 ? enabledClasses : disabledClasses} ${
                      rootFolderId ? "line-through" : ""
                    }`}
                    onClick={() => canAccessStep3 && setCurrentStep(3)}
                  >
                    Set categories
                  </li>
                </ol>
              </div>
            </div>
            <div className=" z-10">
              <div className="p-4 flex flex-col gap-4 bg-muted rounded-l-xl mt-20 h-full shadow-[-20px_0px_20px_-15px_rgba(0,0,0,0.3)]">
                {currentStep === 1 && <OllamaAccordion />}
                {currentStep === 2 && <LlmAccordion />}
                {currentStep === 3 && <CreateFoldersAccordion />}
                {currentStep === 4 && <SortBookmarksSection />}
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
