import { extractRequireFiles } from '~/lib/helpers/ast-parser';
import { formatOnSave } from '~/lib/helpers/editor';

import { expose } from 'comlink';

const options = {
  extractRequireFiles,
  formatOnSave,
};

export type WorkerModule = typeof options;

expose(options);
