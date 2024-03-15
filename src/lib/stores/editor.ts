import { create } from 'zustand';

import type * as monaco from 'monaco-editor';

type State = {
  monaco: monaco.editor.IStandaloneCodeEditor | null;
  code: string;
};

interface Actions {
  setMonaco: (monaco: monaco.editor.IStandaloneCodeEditor) => void;
  setCode: (code: string) => void;
}

export const useEditor = create<State & Actions>((set) => ({
  monaco: null,
  code: '',
  setCode: (code) => set({ code }),
  setMonaco: (monaco) => set({ monaco }),
}));
