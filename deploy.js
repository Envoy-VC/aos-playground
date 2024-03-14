import Irys from '@irys/sdk';

import * as dotenv from 'dotenv';
dotenv.config();

import fs from 'fs';
import path from 'path';

const getDirSize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      size += stats.size;
    } else if (stats.isDirectory()) {
      size += getDirSize(filePath);
    }
  }

  return size;
};

const deploy = async () => {
  const url = 'devnet';
  const providerUrl = 'https://mumbai.rpc.thirdweb.com/';
  const token = 'matic';

  const irys = new Irys({
    url,
    token,
    key: process.env.WALLET_PK,
    config: { providerUrl },
  });
  await irys.ready();
  const folderToUpload = './dist';
  const balance = irys.utils.fromAtomic(await irys.getLoadedBalance());
  console.log('Current Balance: ', balance);
  let size = getDirSize(folderToUpload);
  console.log('Current size: ', size);
  const cost = irys.utils.fromAtomic(await irys.getPrice(size));
  console.log('Cost to Upload: ', cost);
  try {
    const receipt = await irys.uploadFolder(folderToUpload, {
      indexFile: 'index.html',
    });
    console.log(
      `Files uploaded. Manifest ID: https:gateway.irys.xyz/tx/${receipt.id}`
    );
    const balanceAfterUpload = irys.utils.fromAtomic(
      await irys.getLoadedBalance()
    );
    console.log('Balance after upload: ', balanceAfterUpload);
  } catch (e) {
    console.log('Error uploading file ', e);
  }
};

deploy().catch((err) => {
  console.error(err);
  process.exit(1);
});
