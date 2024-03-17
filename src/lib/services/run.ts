// @ts-expect-error no types
import AoLoader from '@permaweb/ao-loader';

export const runCode = async (data: string) => {
  const wasmBinary = await fetch(`/process.wasm`).then((res) =>
    res.arrayBuffer()
  );
  const handle = await AoLoader(wasmBinary);
  
  const env = {
    Process: {
      Id: 'AOS',
      Owner: 'FOOBAR',
      Tags: [{ name: 'Name', value: 'Thomas' }],
    },
  };

  const msg = {
    Target: 'AOS',
    Owner: 'FOOBAR',
    ['Block-Height']: '1000',
    Id: '1234xyxfoo',
    Module: 'WOOPAWOOPA',
    Tags: [{ name: 'Action', value: 'Eval' }],
    Data: data ?? '',
  };

  const result = await handle(null, msg, env);
  return result;
};
