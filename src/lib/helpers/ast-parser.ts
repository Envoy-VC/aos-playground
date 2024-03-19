import traverse from 'traverse';
import { Chunk, Node, parse } from 'luaparse';
import { db } from '../db';

export interface RequireFile {
  filePath: string;
  content: string;
  exists: boolean;
}

export async function getRequireValuesFromAST(
  ast: Chunk
): Promise<RequireFile[]> {
  const requirePcallValues: RequireFile[] = [];
  const visitedFiles = new Set<string>();

  await processRequireStatements(ast);

  async function processRequireStatements(ast: Chunk) {
    // Traverse the AST
    for (const node of traverse(ast).nodes() as Node[]) {
      // Check if the node represents a pcall statement
      if (
        node &&
        node.type === 'CallExpression' &&
        node.base &&
        node.base.type === 'Identifier' &&
        node.base.name === 'pcall'
      ) {
        // Check if the first argument is require and the second argument is a string literal
        if (
          node.arguments &&
          node.arguments.length >= 2 &&
          node.arguments[0] &&
          node.arguments[0].type === 'Identifier' &&
          node.arguments[0].name === 'require' &&
          node.arguments[1] &&
          node.arguments[1].type === 'StringLiteral'
        ) {
          // Push the value passed to require into the array
          const filePath = node.arguments[1].raw;
          const importedFilePath = getFilePath(filePath);
          const res = await db.files.get(importedFilePath);
          const content = res?.content ?? null;

          requirePcallValues.push({
            filePath: importedFilePath,
            content: content ?? '',
            exists: content !== null,
          });

          // Check if the file has been visited already
          if (!visitedFiles.has(filePath)) {
            // Mark the file as visited
            visitedFiles.add(filePath);

            // Read the content of the imported file
            const importedFilePath = getFilePath(filePath); // Adjust the path based on your project structure
            const res = await db.files.get(importedFilePath);
            const content = res?.content ?? '';

            // Parse the content of the imported file
            const importedFileAst = parseLuaContent(content); // You need to implement this function

            // Recursively process require statements in the imported file
            await processRequireStatements(importedFileAst);
          }
        }
      }
    }
  }

  return requirePcallValues;
}

// Assuming you have a function to parse Lua content and obtain its AST
function parseLuaContent(content: string): Chunk {
  return parse(content);
}

export const getFilePath = (filePath: string) => {
  filePath = filePath.replace(/['"]+/g, '');
  const path = filePath.replace(/\./g, '/');
  return `${path}.lua`;
};
