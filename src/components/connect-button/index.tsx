import {
  useProfileModal,
  useActiveAddress,
  useConnection,
} from 'arweave-wallet-kit';

import { Button } from '../ui/button';

import { useQuery } from 'react-query';
import Account from 'arweave-account';
import UserModal from './UserModal';

import { getBalance } from '~/lib/services/balance';

import { LogIn } from 'lucide-react';

const ConnectButton = () => {
  const account = new Account();

  const address = useActiveAddress();
  const { setOpen } = useProfileModal();
  const { connect } = useConnection();

  const { data: profile } = useQuery(['user_profile', address], async () => {
    const res = await account.get(address ?? '');
    return res;
  });

  const { data: balance } = useQuery(['user_balance', address], async () => {
    const balance = await getBalance({
      address: address ?? '',
    });
    return balance;
  });

  const onConnectClick = async () => {
    if (address) {
      setOpen(true);
    } else {
      await connect();
    }
  };

  if (address) {
    return (
      <UserModal profile={profile} balance={balance}>
        <Button variant='ghost' className='h-9 px-3 text-sm font-medium'>
          <div className='flex w-full flex-row items-center gap-2 px-2'>
            <img
              src={
                profile?.profile.avatarURL ===
                'https://arweave.net:443/OrG-ZG2WN3wdcwvpjz1ihPe4MI24QBJUpsJGIdL85wA'
                  ? `https://api.dicebear.com/8.x/identicon/svg?seed=${address}`
                  : profile?.profile.avatarURL
              }
              className='h-7 w-7 rounded-full'
            />
            <div className='flex flex-col items-start'>
              <div className='text-sm font-medium text-neutral-600 dark:text-neutral-200'>
                {profile?.handle.split('#').shift()?.split('@').pop()}
              </div>
              <span className='text-xs font-semibold text-neutral-500 dark:text-neutral-400'>
                {balance ?? '0.00'} CRED
              </span>
            </div>
          </div>
        </Button>
      </UserModal>
    );
  } else {
    return (
      <div>
        <Button
          onClick={onConnectClick}
          variant='ghost'
          className='h-9 px-3 text-sm font-medium'
        >
          <LogIn size={16} />
          <span className='ml-2'>Connect</span>
        </Button>
      </div>
    );
  }
};

export default ConnectButton;
