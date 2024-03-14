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

const CodeSandbox = () => {
  const { code, setCode } = useEditor();
  const { theme } = useTheme();
  const monaco = useMonaco();

  const editorRef = React.useRef<monaco.editor.IStandaloneCodeEditor | null>(
    null
  );

  const handleMount = (editor: monaco.editor.IStandaloneCodeEditor) => {
    editorRef.current = editor;

    const newTheme = theme === 'dark' ? 'ao-dark' : 'ao-light';
    editorRef.current.updateOptions({
      theme: newTheme,
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
    <div className='flex h-screen flex-col gap-4 rounded-xl bg-[#EEEEEE] pb-4 dark:bg-[#0A0A0A]'>
      <ResizablePanelGroup direction='vertical'>
        <ResizablePanel minSize={50} defaultSize={75}>
          <div className='flex flex-col justify-between sm:flex-row sm:items-center'>
            <Menubar className='w-fit rounded-t-xl border-none bg-[#EEEEEE] dark:bg-[#0A0A0A]'>
              <MenubarMenu>
                <MenubarTrigger>File</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Open File <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Save as <MenubarShortcut>⌘⇧S</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarSub>
                    <MenubarSubTrigger>Share</MenubarSubTrigger>
                    <MenubarSubContent>
                      <MenubarItem>Email link</MenubarItem>
                      <MenubarItem>Messages</MenubarItem>
                      <MenubarItem>Notes</MenubarItem>
                    </MenubarSubContent>
                  </MenubarSub>
                  <MenubarSeparator />
                  <MenubarItem>
                    Print... <MenubarShortcut>⌘P</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger>Edit</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem>
                    Send message <MenubarShortcut>⌘ Enter</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem>
                    Open Output <MenubarShortcut>⌘O</MenubarShortcut>
                  </MenubarItem>
                  <MenubarSeparator />
                  <MenubarItem>
                    Refresh State <MenubarShortcut>⌘⇧R</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              <MenubarMenu>
                <MenubarTrigger asChild className='cursor-pointer'>
                  <Link to='/playground' target='_blank'>
                    Go to Playground ↗
                  </Link>
                </MenubarTrigger>
              </MenubarMenu>
            </Menubar>
            <ProcessSpawner />
          </div>
          <Editor
            language='lua'
            height='100%'
            value={code}
            onMount={handleMount}
            options={{
              fontSize: 15,
              wordWrap: 'on',
            }}
            onChange={(v) => setCode(v ?? '')}
          />
        </ResizablePanel>
        <ResizableHandle className='bg-blue-200' />
        <ResizablePanel
          defaultSize={25}
          maxSize={50}
          minSize={20}
          collapsible
          collapsedSize={1}
        >
          messages
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default CodeSandbox;
