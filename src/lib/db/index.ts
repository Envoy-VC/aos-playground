import Dexie, { Table } from 'dexie';

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

  constructor() {
    super('PlaygroundDB');
    this.version(1).stores({
      processes: 'id',
      files: 'path',
      folders: 'path',
      tabs: 'path',
    });
  }
}

export const db = new Database();
