import { createDataItemSigner, message } from '@permaweb/aoconnect';
import { Tag } from '~/types';

interface Props {
  data: string;
  process: string;
  tags: Tag[];
}

export const sendMessage = async ({ data, process, tags }: Props) => {
  const res = await message({
    process,
    data,
    tags,
    signer: createDataItemSigner(window.arweaveWallet),
  });

  return res;
};
