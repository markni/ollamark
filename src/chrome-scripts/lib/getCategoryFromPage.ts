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

  // Create the prompt content
  const promptContent = `Categorize the following web page into exactly one of these categories: ${subfolders.join(
    ", "
  )}

Web page details:
Title: ${wpage.title}
URL: ${wpage.pageUrl}${wpage.body ? `\nBody: ${wpage.body}` : ""}

Think through this step by step:
1. First, analyze the title and identify key topics or themes
2. Then, examine the URL for additional context (like domain type or path structure)
${
  wpage.body
    ? "3. Review the body content for supporting information\n4."
    : "3."
} Compare these themes against the available categories
${
  wpage.body ? "5" : "4"
}. Select the most appropriate category that best matches the overall content

Your response must be exactly one of the provided categories, no other values are allowed.`;

  console.log("Prompt being used:", promptContent);

  // First request with JSON schema
  const payloadWithSchema = {
    model: llmModel,
    messages: [
      {
        role: "user",
        content: promptContent,
      },
    ],
    stream: false,
    format: schema,
  };

  // Second request without JSON schema
  const payloadWithoutSchema = {
    model: llmModel,
    messages: [
      {
        role: "user",
        content: promptContent,
      },
    ],
    stream: false,
  };

  const fullUrl = `${ollamaUrl}/api/chat`;

  // Make both requests
  const [responseWithSchema, responseWithoutSchema] = await Promise.all([
    fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadWithSchema),
    }),
    fetch(fullUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payloadWithoutSchema),
    }),
  ]);

  if (!responseWithSchema.ok || !responseWithoutSchema.ok) {
    throw new Error(
      `HTTP error! Status: ${responseWithSchema.status} / ${responseWithoutSchema.status}`
    );
  }

  const dataWithSchema = await responseWithSchema.json();
  const dataWithoutSchema = await responseWithoutSchema.json();

  console.log("Response with schema:", dataWithSchema);
  console.log("Response without schema:", dataWithoutSchema);

  const content =
    typeof dataWithSchema.message?.content === "string"
      ? JSON.parse(dataWithSchema.message.content)
      : dataWithSchema;
  return content.category;
}
