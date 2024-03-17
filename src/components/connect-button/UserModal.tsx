import React from 'react';
import { ArAccount } from 'arweave-account';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog';

import { useActiveAddress, useConnection } from 'arweave-wallet-kit';
import { useCopyToClipboard } from 'usehooks-ts';

import { Clipboard, LogOut } from 'lucide-react';
import { Button } from '../ui/button';

interface Props extends React.PropsWithChildren {
  profile: ArAccount | undefined;
  balance: string | undefined;
}

const UserModal = ({ children, profile, balance }: Props) => {
  const address = useActiveAddress();
  const { disconnect } = useConnection();
  const [, copyToClipboard] = useCopyToClipboard();

  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className='!rounded-3xl text-black dark:text-white'>
        <DialogHeader>
          <DialogTitle>User Profile</DialogTitle>
          <div className='flex w-full flex-col items-center justify-center gap-2 p-4'>
            <img
              src={
                profile?.profile.avatarURL ===
                'https://arweave.net:443/OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA'
                  ? `https://api.dicebear.com/8.x/identicon/svg?seed=${address}`
                  : profile?.profile.avatarURL
              }
              className='aspect-square w-full max-w-[6rem] rounded-full'
            />
            <div className='flex flex-row items-center gap-1 text-lg font-semibold'>
              {profile?.handle.split('#').shift()?.split('@').pop()}
              <Button
                variant='ghost'
                onClick={() => copyToClipboard(address ?? '')}
                className='!m-0 h-6 w-6 !p-0'
              >
                <Clipboard size={16} />
              </Button>
            </div>
            <span className='font-medium'>
              AOCRED-Test Balance:{' '}
              <span className='font-semibold'>{balance ?? '0.00'}</span>
            </span>
            <Button className='mt-8 w-full rounded-2xl' onClick={disconnect}>
              <LogOut size={16} />
              <span className='ml-2'>Disconnect</span>
            </Button>
          </div>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
