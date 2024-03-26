import { createDataItemSigner, dryrun } from '@permaweb/aoconnect';

interface Props {
  address: string;
}

export const getBalance = async ({ address }: Props) => {
  const res = await dryrun({
    process: `Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc`,
    data: `Send({ Target = "Sa0iBLPNyJQrwpTTG-tWLQU-1QeUAJA73DdxGGiKoJc", Action = "Balance", Tags = { Target = "${address}" } })`,
    tags: [
      { name: 'Action', value: 'Balance' },
      { name: 'Target', value: address },
    ],
    signer: createDataItemSigner(window.arweaveWallet),
  });

  return (parseInt(res.Messages[0]?.Data ?? '0') / 1000).toFixed(2);
};
