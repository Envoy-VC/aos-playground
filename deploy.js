import Irys from '@irys/sdk';

import * as dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

dotenv.config();

const getDirSize = (dirPath) => {
  let size = 0;
  const files = fs.readdirSync(dirPath);

  for (let i = 0; i < files.length; i++) {
    const filePath = path.join(dirPath, files[i]);
    const stats = fs.statSync(filePath);

    if (stats.isFile()) {
      // only add if greater than  because uploads less than 100kb are free
      if (stats.size > 102400) size += stats.size;
    } else if (stats.isDirectory()) {
      size += getDirSize(filePath);
    }
  }

  return size;
};

const deploy = async () => {
  const providerUrl = 'https://sepolia.infura.io/v3/';
  const token = 'ethereum';

  const irys = new Irys({
    network: 'devnet',
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
  if (balance.lt(cost)) {
    console.log('Insufficient balance to upload');
    return;
  }
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
