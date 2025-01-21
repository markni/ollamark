import { LlmResponse } from "../types/responses";

export const handleCheckLlm = (
  message: { url?: string },
  sendResponse: (response: LlmResponse) => void
): boolean => {
  const apiUrl = message.url || "http://localhost:11434";

  // Make a request to get available models
  fetch(`${apiUrl}/api/tags`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(async (response) => {
      if (response.ok) {
        const data = await response.json();
        // Extract model names from the response
        const llmModels =
          data.models?.map((model: { name: string }) => model.name) || [];
        sendResponse({
          success: true,
          llmModels,
        });
      } else {
        sendResponse({
          success: false,
          error: "LLM API returned an error response",
        });
      }
    })
    .catch((error) => {
      sendResponse({
        success: false,
        error: "Could not connect to LLM API: " + error.message,
      });
    });

  return true; // Will respond asynchronously
};
