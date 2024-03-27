import { useTerminalStore } from '~/lib/stores';

import LoadingGrid from '../icons/LoadingGrid';

const CommandLoading = () => {
  const { executing } = useTerminalStore();
  return (
    <>
      {executing && (
        <div className='flex flex-row items-center gap-[6px] py-1'>
          <LoadingGrid
            stroke='#417aff'
            fill='#417aff'
            width={8}
            height={14}
            className=''
          />
          <span className='text-sm font-medium text-[#417aff]'>
            Sending Message...
          </span>
        </div>
      )}
    </>
  );
};

export default CommandLoading;
