import type { Process } from '~/types';

import { useLocalStorage } from 'usehooks-ts';

const useProcess = () => {
  const [activeProcess, setActiveProcess] = useLocalStorage<
    Process | undefined
  >('activeProcess', undefined);

  return {
    activeProcess,
    setActiveProcess,
  };
};

export default useProcess;
