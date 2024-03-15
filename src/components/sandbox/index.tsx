import React from 'react';
import type * as monaco from 'monaco-editor';
import Editor, { useMonaco } from '@monaco-editor/react';

import { useTheme } from '../theme-provider';
import { useEditor } from '~/lib/stores/editor';

import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '~/components/ui/menubar';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

import { darkTheme, lightTheme } from '~/lib/themes';
import { Link } from 'react-router-dom';
import ProcessSpawner from '../process-spawner';
import Messages from '../messages';
import Tabs from '../tabs';

const CodeSandbox = () => {
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
    <div className='flex h-screen w-full flex-col gap-4'>
      <Tabs />
      <ResizablePanelGroup direction='vertical'>
        <ResizablePanel minSize={50} defaultSize={75}>
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
        <ResizableHandle className='bg-neutral-200 dark:bg-neutral-700' />
        <ResizablePanel
          defaultSize={25}
          maxSize={50}
          minSize={20}
          collapsible
          collapsedSize={1}
        >
          <Messages />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeSandbox;
