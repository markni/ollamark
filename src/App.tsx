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
import { BookmarkProvider } from "@/contexts/bookmark";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { OllamaAccordion } from "@/components/OllamaAccordion";
import { LlmAccordion } from "@/components/LlmAccordion.tsx";

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
            <h1 className="text-4xl text-center my-16">
              Let's clean up your messy bookmarks!
            </h1>
            <OllamaAccordion />
            <LlmAccordion />

            <Accordion type="multiple">
              <AccordionItem value="step-3">
                <AccordionTrigger>3. Create folders</AccordionTrigger>
                <AccordionContent>
                  This is the content for step 3
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <section>
              <SortBookmarksSection />
            </section>

            <Separator className="my-4" />
            <section>
              <CreateFoldersSection />
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
