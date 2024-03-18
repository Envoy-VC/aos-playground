import React from 'react';
import * as Types from 'monaco-editor';
import Editor, { useMonaco } from '@monaco-editor/react';

import { useTheme } from '~/components/theme-provider';
import { useEditor } from '~/lib/stores/editor';
import { useLiveQuery } from 'dexie-react-hooks';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

import { darkTheme, lightTheme } from '~/lib/themes';
import DefaultPage from './DefaultPage';

import { Messages, Tabs } from '~/components';
import { db } from '~/lib/db';
import { formatOnSave } from '~/lib/helpers/editor';

const MainPanel = () => {
  const { setMonaco, activePath } = useEditor();
  const { theme } = useTheme();
  const monaco = useMonaco();

  const activeFile = useLiveQuery(async () => {
    const activeFile = await db.files.get(activePath ?? '');
    return activeFile;
  }, [activePath]);

  const onCodeChange = async (code: string) => {
    try {
      if (!activePath) return;
      await db.files.update(activePath, { content: code });
    } catch (error) {}
  };

  const editorRef = React.useRef<Types.editor.IStandaloneCodeEditor | null>(
    null
  );

  const handleMount = (editor: Types.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setMonaco(editor);
    const newTheme = theme === 'dark' ? 'ao-dark' : 'ao-light';
    editorRef.current.updateOptions({
      theme: newTheme,
      fontSize: 15,
    });
    editorRef.current.addAction({
      id: 'saveCommand',
      label: 'Save',
      keybindings: [Types.KeyMod.CtrlCmd | Types.KeyCode.KeyS],
      run: async () => {
        if (!activePath) return;
        await formatOnSave(activePath);
      },
    });
  };

  React.useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('ao-dark', darkTheme);
      monaco.editor.defineTheme('ao-light', lightTheme);
    }
  }, [monaco]);

  React.useEffect(() => {
    if (editorRef.current && monaco) {
      monaco.editor.defineTheme('ao-dark', darkTheme);
      monaco.editor.defineTheme('ao-light', lightTheme);
      const newTheme = theme === 'dark' ? 'ao-dark' : 'ao-light';
      editorRef.current.updateOptions({
        theme: newTheme,
      });
    }
  }, [theme, monaco]);

  return (
    <div className='flex h-screen w-full flex-col'>
      <Tabs />
      <ResizablePanelGroup direction='vertical'>
        <ResizablePanel
          minSize={10}
          defaultSize={75}
          maxSize={100}
          collapsible
          collapsedSize={0}
        >
          {activeFile ? (
            <Editor
              language={activeFile.language}
              value={activeFile.content}
              path={activeFile.path}
              onMount={handleMount}
              options={{
                wordWrap: 'on',
              }}
              onChange={(v) => onCodeChange(v ?? '')}
            />
          ) : (
            <DefaultPage />
          )}
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel
          defaultSize={25}
          maxSize={100}
          minSize={20}
          collapsible
          collapsedSize={0}
        >
          <Messages />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainPanel;
