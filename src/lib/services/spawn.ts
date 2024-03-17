import type { Tag } from '~/types';
import { Process } from '../db';

import { AO_SCHEDULER } from '../utils';
import { spawn, createDataItemSigner } from '@permaweb/aoconnect';

interface Props {
  name?: string;
  module?: string;
  scheduler?: string;
  owner: string;
}

const getRandomIntInclusive = (min: number, max: number) => {
  const randomBuffer = new Uint32Array(1);
  crypto.getRandomValues(randomBuffer);
  const randomNumber = randomBuffer[0]! / (0xffffffff + 1);
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(randomNumber * (max - min + 1)) + min;
};

export const spawnProcess = async ({
  name,
  module,
  scheduler,
  owner,
}: Props) => {
  const randomName = `Playground: ${getRandomIntInclusive(1000, 999999)}`;
  const tags: Tag[] = [
    { name: 'App-Name', value: 'aos' },
    { name: 'Name', value: name ?? randomName },
  ];

  const latestModule = await getLatestModule();

  const res = await spawn({
    module: module ?? latestModule,
    scheduler: scheduler ?? AO_SCHEDULER,
    tags,
    signer: createDataItemSigner(window.arweaveWallet),
  });

  const data: Process = {
    id: res,
    name: name ?? randomName,
    module: module ?? latestModule,
    scheduler: scheduler ?? AO_SCHEDULER,
    owner,
  };

  return data;
};

export const getProcessById = async (id: string) => {
  const query = `
    query ($id: ID!) {
      transaction(id: $id) {
        owner {
          address
        }
        tags {
          name
          value
        }
      }
    }
  `;

  const res = await fetch('https://arweave.net/graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query,
      variables: { id },
    }),
  });

  const data = (await res.json()) as {
    data: {
      transaction: {
        owner: {
          address: string;
        };
        tags: Tag[];
      } | null;
    };
  };

  if (!data.data.transaction) {
    throw new Error('Transaction not found');
  }

  const requiredTags: Tag[] = [
    {
      name: 'Data-Protocol',
      value: 'ao',
    },
    {
      name: 'Type',
      value: 'Process',
    },
  ];
  const transaction = data.data.transaction;
  const tags = transaction.tags;

  requiredTags.forEach((tag) => {
    const has =
      tags.find((val) => val.name === tag.name && val.value === tag.value) ??
      null;

    if (!has) {
      throw new Error('Invalid Process Format!');
    }
  });

  const name =
    tags.find((tag) => tag.name === 'Name')?.value ??
    `Playground: ${getRandomIntInclusive(1000, 999999)}`;

  const module = tags.find((tag) => tag.name === 'Module')?.value ?? '';
  const scheduler = tags.find((tag) => tag.name === 'Scheduler')?.value ?? '';

  const process: Process = {
    id,
    owner: transaction.owner.address,
    name,
    module,
    scheduler,
  };

  return process;
};

export const getLatestModule = async () => {
  try {
    const res = (await fetch(
      'https://raw.githubusercontent.com/permaweb/aos/main/package.json'
    ).then((res) => res.json())) as { aos: { module: string } };
    return res.aos.module;
  } catch (error) {
    throw new Error('Failed to fetch latest module');
  }
};
