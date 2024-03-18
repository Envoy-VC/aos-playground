import Dexie, { Table } from 'dexie';
import { AoResult } from '~/types';

export interface AoResultWithProcess extends AoResult {
  process: string;
}

export interface Process {
  id: string;
  name: string;
  owner: string;
  module: string;
  scheduler: string;
}

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

export class Database extends Dexie {
  processes!: Table<Process>;
  files!: Table<EditorFile>;
  folders!: Table<EditorFolder>;
  tabs!: Table<{ path: string }>;
  results!: Table<AoResultWithProcess, number>;

  constructor() {
    super('PlaygroundDB');
    this.version(1).stores({
      processes: 'id',
      files: 'path',
      folders: 'path',
      tabs: 'path',
      results: '++id, &cursor, process',
    });
  }
}

export const db = new Database();
