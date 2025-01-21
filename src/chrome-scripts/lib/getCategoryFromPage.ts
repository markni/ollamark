import { DEFAULT_SUBFOLDERS, DEFAULT_OLLAMA_URL } from "../../constants";

interface WebPage {
  title: string;
  pageUrl: string;
  body?: string;
}

interface GetCategoryOptions {
  wpage: WebPage;
  subfolders?: string[];
  ollamaUrl?: string;
  llmModel: string;
}

export default async function getCategoryFromPage({
  wpage,
  subfolders = DEFAULT_SUBFOLDERS,
  ollamaUrl = DEFAULT_OLLAMA_URL,
  llmModel,
}: GetCategoryOptions): Promise<string> {
  // Define the JSON schema for the expected response
  const schema = {
    type: "object",
    properties: {
      category: {
        type: "string",
      },
    },
    required: ["category"],
  } as const;

  // Prepare the request payload for the Ollama API
  const payload = {
    model: llmModel,
    messages: [
      {
        role: "user",
        content: `Categorize the following web page into exactly one of these categories: ${subfolders.join(
          ", "
        )}

Web page details:
Title: ${wpage.title}
URL: ${wpage.pageUrl}
Body: ${wpage.body || ""}

Your response must be exactly one of the provided categories, no other values are allowed.`,
      },
    ],
    stream: false,
    format: schema,
  };

  const fullUrl = `${ollamaUrl}/api/chat`;
  const response = await fetch(fullUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }

  const data = await response.json();
  const content =
    typeof data.message?.content === "string"
      ? JSON.parse(data.message.content)
      : data;
  return content.category;
}
