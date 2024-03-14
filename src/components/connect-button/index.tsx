import {
  useProfileModal,
  useActiveAddress,
  useConnection,
} from 'arweave-wallet-kit';

import { Button } from '../ui/button';

const ConnectButton = () => {
  const address = useActiveAddress();
  const { open, setOpen } = useProfileModal();
  const { connect } = useConnection();

  const onConnectClick = async () => {
    if (address) {
      setOpen(true);
    } else {
      await connect();
    }
  };

  const onProfileClick = async () => {
    setOpen(!open);
  };

  if (address) {
    return (
      <Button
        onClick={onProfileClick}
        className='h-9 px-3 text-sm font-semibold'
      >
        {address.slice(0, 5)}...{address.slice(-5)}
      </Button>
    );
  } else {
    return (
      <div>
        <Button
          onClick={onConnectClick}
          className='h-9 px-3 text-sm font-semibold'
        >
          Connect
        </Button>
      </div>
    );
  }
};

export default ConnectButton;
