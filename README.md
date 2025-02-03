# <img src="./public/ollamark-logo.png" width="32" alt="Ollamark Logo"> Ollamark

Ollamark is a Chrome extension that helps you automatically organize your bookmarks into meaningful categories using your local Ollama instance. It leverages AI to analyze and sort your bookmarks, making them easier to manage and find.

## Features

- 🤖 AI-powered bookmark categorization
- 🏠 Works with your local Ollama instance
- 🔄 Automatic bookmark sorting
- 🎯 Custom category management
- 🔒 Privacy-focused (processes everything locally)

## Planned Features

- 🔍 Quick search for bookmarks
- 📁 Smart categories creation
- 🔄 Duplicate bookmark detection
- 🔗 Broken link detection

## Prerequisites

- Chrome browser
- [Ollama](https://ollama.ai/) installed and running locally
- Node.js and npm/yarn for development

## Installation

1. Clone this repository

```
git clone https://github.com/yourusername/ollamark.git
cd ollamark
```

2. Install dependencies

```
npm install
```

3. Build the extension

```
npm run build
```

The build will re-build for file changes, no live reload for now, developer will need to reload manually. Any changes made to background script will need a refresh in chrome://extensions/ page.

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` directory from your build

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the local AI capabilities
- [Shadcn](https://ui.shadcn.com/) for the UI components
