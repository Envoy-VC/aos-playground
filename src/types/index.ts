/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Chunk } from 'luaparse';

export type Tag = {
  name: string;
  value: string;
};

export type AoResult = {
  cursor: string;
  node: {
    Output: {
      data:
        | {
            json?: string;
            output?: string;
            prompt?: string;
          }
        | string;
      prompt: string;
      print: boolean;
    };
    Messages: any[];
    Spawns: any[];
  };
};

export interface AoResultWithProcess extends AoResult {
  process: string;
}

export type AoResults = {
  edges: AoResult[];
};

export interface Process {
  id: string;
  name: string;
  owner: string;
  module: string;
  scheduler: string;
}

export type Result =
  | {
      id?: number;
      type: 'command';
      process: string;
      cursor: string;
      command: string;
    }
  | {
      id?: number;
      type: 'output';
      process: string;
      cursor: string;
      output: AoResult;
    };

export interface EditorFile {
  path: string;
  name: string;
  parentFolder: string;
  language: string;
  content: string;
}

export interface EditorFolder {
  path: string;
  name: string;
  parentFolder: string;
  isCollapsed: boolean;
}

export interface RequireFile {
  filePath: string;
  content: string;
  exists: boolean;
  ast: Chunk;
}

export interface EditorConfig {
  theme?: 'ao-light' | 'ao-dark';
  fontSize?: number;
}

export const defaultConfig: EditorConfig = {
  theme: 'ao-light',
  fontSize: 15,
};
