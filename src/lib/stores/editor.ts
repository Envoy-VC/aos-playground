import { create } from 'zustand';

import type * as monaco from 'monaco-editor';

type State = {
  isCreating: 'file' | 'folder' | null;
  name: string;
  parentFolder: string;
  monaco: monaco.editor.IStandaloneCodeEditor | null;
  code: string;
};

interface Actions {
  setMonaco: (monaco: monaco.editor.IStandaloneCodeEditor) => void;
  setCode: (code: string) => void;
  setIsCreating: (type: 'file' | 'folder' | null) => void;
  setParentFolder: (parentFolder: string) => void;
  setName: (name: string) => void;
}

export const useEditor = create<State & Actions>((set) => ({
  monaco: null,
  code: '',
  isCreating: null,
  parentFolder: '/',
  name: '',
  setCode: (code) => set({ code }),
  setMonaco: (monaco) => set({ monaco }),
  setIsCreating: (isCreating) => set({ isCreating }),
  setParentFolder: (parentFolder) => set({ parentFolder }),
  setName: (name) => set({ name }),
}));
