import type { Tag } from '~/types';

import { useLocalStorage } from 'usehooks-ts';

const useTags = () => {
  const [defaultTags, setDefaultTags] = useLocalStorage<Tag[]>('defaultTags', [
    {
      name: 'Action',
      value: 'Eval',
    },
  ]);

  return {
    defaultTags,
    setDefaultTags,
  };
};

export default useTags;
