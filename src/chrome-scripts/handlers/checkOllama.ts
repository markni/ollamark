import { OllamaResponse } from "../types/responses";

export const handleCheckOllama = (
  message: { url?: string },
  sendResponse: (response: OllamaResponse) => void
) => {
  console.log("Checking Ollama status");
  const apiUrl = message.url || "http://localhost:11434";

  fetch(`${apiUrl}/api/version`)
    .then((response) => response.json())
    .then((data) => {
      sendResponse({ success: true, version: data.version });
    })
    .catch((error) => {
      sendResponse({ success: false, error: error.message });
    });
  return true;
};
