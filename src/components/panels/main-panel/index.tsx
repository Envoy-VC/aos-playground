import React from 'react';

import { db } from '~/lib/db';
import { closeTab, formatOnSave } from '~/lib/helpers/editor';
import { useToast } from '~/lib/hooks';
import { useTheme } from '~/lib/hooks';
import { useDebugFile } from '~/lib/stores';
import { useEditor } from '~/lib/stores/editor';
import { editorThemes } from '~/lib/themes';
import { cn } from '~/lib/utils';

// import { darkTheme, lightTheme } from '~/lib/themes';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '~/components/ui/resizable';

import Editor, { useMonaco } from '@monaco-editor/react';
import { shikiToMonaco } from '@shikijs/monaco';
import { getHighlighter } from 'shiki';
import { Messages, Tabs } from '~/components';
import { EditorConfig, defaultConfig } from '~/types';

import DebugPanel from '../debug-panel';
import DefaultPage from './DefaultPage';

import { useLiveQuery } from 'dexie-react-hooks';
import * as Types from 'monaco-editor';
import { useLocalStorage } from 'usehooks-ts';

const MainPanel = () => {
  const { theme } = useTheme();
  const monaco = useMonaco();
  const { toast } = useToast();
  const { setMonaco, activePath, setActivePath } = useEditor();
  const { isActive: isDebuggerActive, result } = useDebugFile();

  const [editorOptions] = useLocalStorage<EditorConfig>(
    'editorOptions',
    defaultConfig
  );

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

  const handleMount = async (editor: Types.editor.IStandaloneCodeEditor) => {
    setMonaco(editor);

    const themes = editorThemes.map((theme) => theme.name);

    const highlighter = await getHighlighter({
      themes,
      langs: ['javascript', 'typescript', 'lua', 'markdown', 'json'],
    });

    if (monaco) {
      monaco.languages.register({ id: 'lua' });
      monaco.languages.register({ id: 'typescript' });
      monaco.languages.register({ id: 'javascript' });
      monaco.languages.register({ id: 'json' });
      monaco.languages.register({ id: 'markdown' });
      shikiToMonaco(highlighter, monaco);
    }

    const newTheme =
      theme === 'dark' ? editorOptions.darkTheme : editorOptions.lightTheme;

    editor.updateOptions({
      ...editorOptions,
      theme: newTheme,
    });

    editor.addAction({
      id: 'saveCommand',
      label: 'Save',
      keybindings: [Types.KeyMod.CtrlCmd | Types.KeyCode.KeyS],
      run: async (editor) => {
        const model = editor.getModel();
        if (!model) return;

        const activePath = model.uri.path;
        try {
          await formatOnSave(activePath);
        } catch (error) {
          toast.error({ description: (error as Error).message });
        }
      },
    });
    editor.addAction({
      id: 'closeActiveTab',
      label: 'Close Tab',
      keybindings: [Types.KeyMod.WinCtrl | Types.KeyCode.KeyW],
      run: async (editor) => {
        const model = editor.getModel();
        if (!model) return;

        const activePath = model.uri.path;
        await closeTab(activePath);
        setActivePath(null);
      },
    });
    editorRef.current = editor;
  };

  React.useEffect(() => {
    if (editorRef.current) {
      const newTheme =
        theme === 'dark' ? editorOptions.darkTheme : editorOptions.lightTheme;
      console.log(newTheme);
      editorRef.current.updateOptions({
        theme: newTheme,
      });
    }
  }, [theme]);

  return (
    <div className='flex h-screen w-full flex-col'>
      <Tabs />
      <ResizablePanelGroup
        direction='vertical'
        autoSaveId='editor-messages=group'
      >
        <ResizablePanel
          minSize={10}
          defaultSize={75}
          maxSize={100}
          collapsible
          collapsedSize={0}
        >
          {isDebuggerActive && result.length > 0 ? (
            <DebugPanel />
          ) : activeFile ? (
            <Editor
              language={activeFile.language}
              value={activeFile.content}
              path={activeFile.path.slice(1, activeFile.path.length)}
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
          minSize={10}
          collapsible
          collapsedSize={0}
          className='h-full'
        >
          <Messages />
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};

export default MainPanel;
