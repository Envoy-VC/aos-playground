export type TerminalCommand = {
  name: string;
  params: string[];
  flags: string[];
  description: string;
  usage: string;
  handler: (args: string[]) => Promise<void> | void;
};
