import { message, createDataItemSigner } from '@permaweb/aoconnect';

interface Props {
  data: string;
  process: string;
}

export const sendMessage = async ({ data, process }: Props) => {
  const res = await message({
    process,
    data,
    tags: [{ name: 'Action', value: 'Eval' }],
    signer: createDataItemSigner(window.arweaveWallet),
  });

  return res;
};
