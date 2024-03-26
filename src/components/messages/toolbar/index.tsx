import { toolbarItems } from '~/lib/data';
import { useMessagesPanel } from '~/lib/stores/messages';
import { cn } from '~/lib/utils';

const Toolbar = () => {
  const { activeKey, setActiveKey } = useMessagesPanel();
  return (
    <div className='flex flex-row items-center justify-between px-4 py-2'>
      <div className='flex flex-row items-center gap-6'>
        {toolbarItems.map((item) => (
          <button
            key={item.key}
            className={cn(
              'text-[0.9rem] font-medium uppercase text-neutral-500 transition-all duration-200 ease-in-out hover:text-neutral-700 dark:text-neutral-400 hover:dark:text-neutral-300',
              activeKey === item.key &&
                'text-neutral-700 underline underline-offset-4 dark:text-neutral-400'
            )}
            onClick={() => setActiveKey(item.key)}
          >
            {item.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Toolbar;
