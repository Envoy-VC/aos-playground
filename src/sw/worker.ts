import { extractRequireFiles } from '~/lib/helpers/ast-parser';

import { expose } from 'comlink';

const options = {
  extractRequireFiles,
};

export type WorkerModule = typeof options;

expose(options);
