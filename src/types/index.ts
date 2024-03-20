export type Tag = {
  name: string;
  value: string;
};

export type AoResult = {
  cursor: string;
  node: {
    Output: {
      data:
        | {
            json: string;
            output: string;
            prompt: string;
          }
        | string;
      prompt: string;
      print: boolean;
    };
    Messages: any[];
    Spawns: any[];
  };
};

export type AoResults = {
  edges: AoResult[];
};

export interface EditorConfig {
  theme?: 'ao-light' | 'ao-dark';
  fontSize?: number;
}

export const defaultConfig: EditorConfig = {
  theme: 'ao-light',
  fontSize: 15,
};
