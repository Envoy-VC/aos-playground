import { EditorFile, EditorFolder, Process, Result } from '~/types';

import Dexie, { Table } from 'dexie';

export class Database extends Dexie {
  processes!: Table<Process>;
  files!: Table<EditorFile>;
  folders!: Table<EditorFolder>;
  tabs!: Table<{ path: string }>;
  results!: Table<Result, number>;

  constructor() {
    super('PlaygroundDB');
    this.version(1).stores({
      processes: 'id',
      files: 'path',
      folders: 'path',
      tabs: 'path',
      results: '++id, &cursor, process, type',
    });
  }
}

export const db = new Database();
