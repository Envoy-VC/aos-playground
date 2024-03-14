import { create } from 'zustand';

type EditorState = {
  code: string;
  setCode: (code: string) => void;
};

export const useEditor = create<EditorState>((set) => ({
  code: '',
  setCode: (code) => set({ code }),
}));
