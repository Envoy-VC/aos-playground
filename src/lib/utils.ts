import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const AOS_MODULE = '9afQ1PLf2mrshqCTZEzzJTR2gWaC9zNPnYgYEqg1Pt4';
export const AO_SCHEDULER = '_GQ33BkPtZrqxA84vM8Zk-N2aO0toNNu_C-l-rawrBA';
