<p align="center">
  <picture aligh="center">
    <source media="(prefers-color-scheme: dark)" srcset="./logo-dark.png">
    <img alt="AOS Playground Logo" src="./logo-light.png" width="400px">
  </picture>
</p>

<p align="center">Welcome to the AOS Web Playground! Web Interface for 'ao' Permaweb Computer Grid 🐰 🕳️ 👈</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#how-it-works">How it works?</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="https://aos_playground.ar-io.dev">Try Now ↗️</a>
</p>

<img alt="AOS Playground Image" src="https://devnet.irys.xyz/_4HXmADnGz1E0UUzKFOMKHcvX4oy1I3ubq0ZLNrrH5U" style="border-radius: 8px;" >

## Features

- 🌐 **Decentralized**: AOS Playground is hosted on the Permaweb network.
- ✨ **Multi-modal Support**: Multi-modal editor with a native file explorer built in.
- 📦 **Resolved Imports**: Import from other files in the explorer using `pcall`.
- 🗣️ **Language Formatting**: Language formatting for Lua files using wasm module.
- 🐞 **Debugging**: Supports debugging using the Lua AST Parser.
- 💾 **Persistence**: Entire application is persisted using LocalStorage and IndexedDB.
- 🎨 **Themes**: Supports Multiple themes such as `Andromeda`, `Poimandres`, `Github Light/Dark`, `Slack Ochin`, and more

## How it works?

AOS Playground is a web interface for the AO Operating System. It is hosted on the Permaweb network and uses the `@permaweb/aoconnect` SDK to interact with the network.

The main part of the application using `monaco-editor` by Microsoft. The editor is configured to support Lua language.

Language formatting is done using a custom compiled wasm module which runs in workers. (`⌘ + S` to test it)

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

First a Abstract Syntax Trr will be generated for the Lua file.

<details>
<summary>
Abstract Syntax Tree for index.lua
</summary>

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

</details>

Then the content is traversed for any pcall statements. If a pcall statement is found, the value of the CallExpression is resolved in the local file explorer.

If the file is found then it recursively checks that file for other imports until there are no more imports.

Then the order of execution is determined and the files are executed in that order.

> **Why pcall instead of require?**
>
> The reason for using pcall is to catch any errors that might occur during the execution of the file. If an error occurs, the error is caught and the error message is returned instead of the throwing the actual error.

## Tech Stack

- **Frontend**: `React`, `TypeScript`, `TailwindCSS`, `@shadcn/ui`
- **Editor**: `Monaco Editor`, `skiki` (Syntax highlighting)
- **Persistence**: `Dexie` and `LocalStorage`
- **Querying**: `React Query`
- **AO Operations**: `@permaweb/aoconnect`
- **Language Formatting**: Custom compiled `wasm` module
- **Debugging**: `Lua AST Parser`

## License

MIT
