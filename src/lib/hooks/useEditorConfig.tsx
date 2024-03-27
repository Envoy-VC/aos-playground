import { EditorConfig, defaultConfig } from '~/types';

import { useLocalStorage } from 'usehooks-ts';

const useEditorConfig = () => {
  const [editorOptions, setEditorConfig] = useLocalStorage<EditorConfig>(
    'editorOptions',
    defaultConfig
  );
  return { editorOptions, setEditorConfig };
};

export default useEditorConfig;
