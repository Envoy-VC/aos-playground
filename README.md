# 🖥️ AOS Playground

<p align="center">Web Interface for AO Operating System (AOS)</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How it works?</a> •
<a href="#tech-stack">Tech Stack</a> •
<a href="https://www.youtube.com/watch?v=1vL3MEufW9w">Demo Video ↗️</a> •
<a href="https://arweave.net/rCijTvsbWTdUdNB2ZjG-k55L73JlOnxCPjf_UTMnU4M">Try Now ↗️</a>

</p>

![Playground](https://devnet.irys.xyz/_4HXmADnGz1E0UUzKFOMKHcvX4oy1I3ubq0ZLNrrH5U)

## Features

- 🌐 **Decentralized**: AOS Playground is hosted on the Permaweb network.
- ✨ **Multi-modal Support**: Multi-modal editor with a native file explorer.
- 📦 **Resolved Imports**: Import from other files in the explorer (more info in _**how it works?**_)
- 🗣️ **Language Formatting**: Language formatting for Lua files using wasm module running in workers.
- 🐞 **Debugging**: Supports debugging using the Lua AST Parser.
- 💾 **Persistence**: Entire application is persisted using LocalStorage and IndexedDB.
- 🎨 **Themes**: Supports Light and Dark themes.

## How it works?

AOS Playground is a web interface for the AO Operating System. It is hosted on the Permaweb network and uses the `@permaweb/aoconnect` SDK to interact with the network.

The main part of the application using `monaco-editor` by Microsoft. The editor is configured to support Lua language.

Language formatting is done using a custom compiled wasm module which runs in workers. (`CTRL + S` to test it)

The core feature of the editor is module resolve and import. Let's take an example to see how it works

```lua
-- src/file1.lua

file1 = {
  message = "Message from File 1"
}
```

```lua
-- index.lua

local ok = pcall(require,".src.file1")

return file1.message
```

What happens when you run `index.lua` file?

First a Abstract Syntax Trr will be generated for the Lua file. It looks something like this:

```json
{
  "type": "Chunk",
  "body": [
    {
      "type": "LocalStatement",
      "variables": [
        {
          "type": "Identifier",
          "name": "ok"
        }
      ],
      "init": [
        {
          "type": "CallExpression",
          "base": {
            "type": "Identifier",
            "name": "pcall"
          },
          "arguments": [
            {
              "type": "Identifier",
              "name": "require"
            },
            {
              "type": "StringLiteral",
              "value": null,
              "raw": "\".src.file1\""
            }
          ]
        }
      ]
    },
    {
      "type": "ReturnStatement",
      "arguments": [
        {
          "type": "MemberExpression",
          "indexer": ".",
          "identifier": {
            "type": "Identifier",
            "name": "message"
          },
          "base": {
            "type": "Identifier",
            "name": "file1"
          }
        }
      ]
    }
  ],
  "comments": [
    {
      "type": "Comment",
      "value": " index.lua",
      "raw": "-- index.lua"
    }
  ]
}
```

Then the content is traversed for any pcall statements. If a pcall statement is found, the value of the CallExpression is resolved in the local file explorer.

If the file is found then it recursively checks that file for other imports until there are no more imports.

Then the order of execution is determined and the files are executed in that order.

> **Why pcall instead of require?**
>
> The reason for using pcall is to catch any errors that might occur during the execution of the file. If an error occurs, the error is caught and the error message is returned instead of the throwing the actual error.

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, shadcn/ui
- **Persistence**: Dexie and LocalStorage
- **Querying**: React Query
- **AO Operations**: `@permaweb/aoconnect`
- **Language Formatting**: Custom compiled wasm module running in workers.
- **Debugging**: Lua AST Parser
-

## License

MIT
