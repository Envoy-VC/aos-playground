import React from 'react';
import type * as monaco from 'monaco-editor';
import Editor, { useMonaco } from '@monaco-editor/react';

import { useTheme } from '~/components/theme-provider';
import { useEditor } from '~/lib/stores/editor';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

import { darkTheme, lightTheme } from '~/lib/themes';

import { Messages, Tabs } from '~/components';

const MainPanel = () => {
  const { code, setCode, setMonaco } = useEditor();
  const { theme } = useTheme();
  const monaco = useMonaco();

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;
    setMonaco(editor);
    const newTheme = theme === 'dark' ? 'ao-dark' : 'ao-light';
    editorRef.current.updateOptions({
      theme: newTheme,
      fontSize: 15,
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
          <Editor
            language='lua'
            value={code}
            onMount={handleMount}
            options={{
              wordWrap: 'on',
            }}
            onChange={(v) => setCode(v ?? '')}
          />
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
