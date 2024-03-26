import { BugPlay, Cpu, Files } from 'lucide-react';

export const AO_SCHEDULER = '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA';

export const toolbarItems = [
  {
    name: 'Output',
    key: 'output',
  },
] as const;

export const sidebarItems = [
  {
    title: 'Files',
    icon: Files,
    key: 'files',
  },
  {
    title: 'Processes',
    icon: Cpu,
    key: 'processes',
  },
  {
    title: 'Run & Debug',
    icon: BugPlay,
    key: 'run',
  },
] as const;
