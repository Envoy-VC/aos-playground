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
