# <img src="./public/ollamark-logo.png" width="32" alt="Ollamark Logo"> Ollamark

Ollamark is a Chrome extension that helps you automatically organize your bookmarks into meaningful categories using your local Ollama instance. It leverages AI to analyze and sort your bookmarks, making them easier to manage and find.

## Features

- 🤖 AI-powered bookmark categorization
- 🏠 Works with your local Ollama instance
- 🔄 Automatic bookmark sorting
- 📁 Smart folder creation
- 🎯 Custom category management
- 🔒 Privacy-focused (processes everything locally)

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

4. Load the extension in Chrome:
   - Open Chrome and navigate to `chrome://extensions/`
   - Enable "Developer mode" in the top right
   - Click "Load unpacked"
   - Select the `dist` directory from your build

## Development

- Start development server:

```
npm run dev
```

- Lint your code:

```
npm run lint
```

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI Components
- Chrome Extensions API

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License

## Acknowledgments

- [Ollama](https://ollama.ai/) for providing the local AI capabilities
- [Radix UI](https://www.radix-ui.com/) for the UI components
