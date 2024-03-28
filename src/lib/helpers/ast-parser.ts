import { WorkerModule } from '~/sw/worker';
import type { RequireFile } from '~/types';

import { db } from '../db';

import { wrap } from 'comlink';
import { type Chunk, type Node, parse } from 'luaparse';
import traverse from 'traverse';

export async function extractRequireFiles(
  filePath: string
): Promise<RequireFile[]> {
  const requirePcallValues: RequireFile[] = [];
  const visitedFiles = new Set<string>();

  const content = (await db.files.get(filePath))?.content ?? '';
  const ast = parse(content, { luaVersion: '5.3' });

  requirePcallValues.push({
    filePath,
    ast,
    content,
    exists: true,
  });

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
          const content = res?.content ?? '';

          const ast = parse(content, {
            luaVersion: '5.3',
          });

          requirePcallValues.push({
            filePath: importedFilePath,
            content,
            exists: content !== '',
            ast,
          });

          // Check if the file has been visited already
          if (!visitedFiles.has(filePath)) {
            // Mark the file as visited
            visitedFiles.add(filePath);

            // Recursively process require statements in the imported file
            await processRequireStatements(ast);
          }
        }
      }
    }
  }

  return requirePcallValues;
}

export const getFilePath = (filePath: string) => {
  filePath = filePath.replace(/['"]+/g, '');
  const path = filePath.replace(/\./g, '/');
  return `${path}.lua`;
};

export const getRequireValuesFromAST = async (filePath: string) => {
  const url = new URL('../../sw/worker', import.meta.url);
  const worker = new Worker(url, { type: 'module' });
  const instance = wrap<WorkerModule>(worker);
  const res = await instance.extractRequireFiles(filePath);
  return res;
};
