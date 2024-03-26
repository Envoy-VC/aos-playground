import {
  AoResultWithProcess,
  EditorFile,
  EditorFolder,
  Process,
} from '~/types';

import Dexie, { Table } from 'dexie';

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
