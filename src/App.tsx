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
import { MESSAGE_ACTIONS } from "@/constants";

import { OllamaAccordion } from "@/components/OllamaAccordion";
import { LlmAccordion } from "@/components/LlmAccordion";
import { CreateFoldersAccordion } from "@/components/CreateFoldersAccordion";
import { StepBlueTab } from "@/components/StepBlueTab";
// import Bookshelf from "@/components/Bookshelf";
import React from "react";
import llamaImage from "@/assets/llama.png";
function Footer() {
  const handleDebugReset = () => {
    chrome.runtime.sendMessage(
      { action: MESSAGE_ACTIONS.DEBUG_RESET_BOOKMARKS },
      (response) => {
        console.log("Debug reset response:", response);
      }
    );
  };

  return (
    <footer className="fixed bottom-0 w-full bg-background border-t z-20">
      <div className="container mx-auto p-4 text-center text-sm text-muted-foreground">
        <p>
          Love Ollamark?{" "}
          <a
            href="https://github.com/markni/ollamark"
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-blue-500"
          >
            Star us on GitHub
          </a>
          ! Built with 🤖 and open-sourced under the{" "}
          <a
            href="https://opensource.org/licenses/MIT"
            target="_blank"
            rel="noreferrer"
            className="hover:underline text-blue-500"
          >
            MIT license
          </a>
          .
        </p>
        {import.meta.env.MODE === "development" && (
          <Button
            variant="outline"
            size="sm"
            onClick={handleDebugReset}
            className="mt-2"
          >
            Debug: Reset Bookmarks
          </Button>
        )}
      </div>
    </footer>
  );
}

function App() {
  React.useEffect(() => {
    // Connect to the background script
    const port = chrome.runtime.connect({ name: "bookmark-organizer" });

    // Cleanup on unmount
    return () => {
      port.disconnect();
    };
  }, []);

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
                {currentStep === 1 && <OllamaAccordion />}
                {currentStep === 2 && <LlmAccordion />}
                {currentStep === 3 && <CreateFoldersAccordion />}
                {currentStep === 4 && <SortBookmarksSection />}
                <div className="flex-1 flex items-end justify-center mb-40">
                  <img
                    src={llamaImage}
                    alt="Llama"
                    className="max-w-[800px] w-full hidden"
                  />
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
