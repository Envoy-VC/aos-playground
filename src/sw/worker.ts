/// <reference lib="webworker" />
declare const self: DedicatedWorkerGlobalScope;

import { runCode } from '~/lib/services/run';

export async function run(data: string) {
  try {
    const result = await runCode(data);
    return result;
  } catch (error) {
    return error;
  }
}
