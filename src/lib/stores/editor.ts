import { create } from 'zustand';

import type * as monaco from 'monaco-editor';

type State = {
  isCreating: 'file' | 'folder' | null;
  name: string;
  parentFolder: string;
  monaco: monaco.editor.IStandaloneCodeEditor | null;
  activePath: string | null;
};

interface Actions {
  setMonaco: (monaco: monaco.editor.IStandaloneCodeEditor) => void;
  setIsCreating: (type: 'file' | 'folder' | null) => void;
  setParentFolder: (parentFolder: string) => void;
  setName: (name: string) => void;
  setActivePath: (activePath: string | null) => void;
}

export const useEditor = create<State & Actions>((set) => ({
  monaco: null,
  isCreating: null,
  parentFolder: '/',
  name: '',
  activePath: null,
  setMonaco: (monaco) => set({ monaco }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setParentFolder: (parentFolder) => set({ parentFolder }),
  setName: (name) => set({ name }),
  setActivePath: (activePath) => set({ activePath }),
}));
