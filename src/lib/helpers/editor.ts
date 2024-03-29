// @ts-expect-error err
import { Config, formatCode } from '$/stylua_lib_bg';
import { languageIcons } from '~/assets';

import { db } from '../db';

export const supportedExtensions = [
  'js',
  'ts',
  'tsx',
  'jsx',
  'json',
  'md',
  'lua',
  'py',
  'txt',
];

export const extensionToLanguage = (extension: string) => {
  switch (extension) {
    case 'js':
      return 'javascript';
    case 'ts':
      return 'typescript';
    case 'tsx':
      return 'typescriptreact';
    case 'jsx':
      return 'javascriptreact';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'lua':
      return 'lua';
    case 'py':
      return 'python';
    case 'txt':
      return 'text';
    default:
      return 'text';
  }
};

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop() ?? '';

  const icon = languageIcons[extension] ?? null;
  return icon;
};

export const onCreate = async (
  parentFolder: string,
  name: string,
  isCreating: 'file' | 'folder'
) => {
  if (name.trim() === '') {
    throw new Error('Name cannot be empty');
  }

  const type = isCreating === 'file' ? 'file' : 'folder';
  if (type === 'file') {
    const extension = name.split('.').pop() ?? null;
    if (!extension) {
      throw new Error('Invalid file name');
    }
    if (!supportedExtensions.includes(extension)) {
      throw new Error('Unsupported file extension');
    }
    const path = `${parentFolder}${name}`;

    const file = await db.files.get(path);

    if (file) {
      throw new Error(`File ${name} already exists`);
    }

    const regex = new RegExp('^[a-zA-Z0-9_]*\\.[a-zA-Z0-9_]*$|^[a-zA-Z0-9_]*$');

    if (!regex.test(name)) {
      throw new Error('Invalid file name');
    }

    await db.files.add({
      path,
      name,
      parentFolder,
      language: extensionToLanguage(extension),
      content: '',
    });
  } else {
    const path = `${parentFolder}${name}/`;
    const folder = await db.folders.get(path);
    if (folder) {
      throw new Error(`Folder ${name} already exists`);
    }

    // only alphanumeric and underscore and spaces
    const regex = new RegExp(
      '^[a-zA-Z0-9_ ]*\\.[a-zA-Z0-9_ ]*$|^[a-zA-Z0-9_ ]*$'
    );
    if (!regex.test(name)) {
      throw new Error('Invalid folder name');
    }

    await db.folders.add({
      path,
      name,
      parentFolder,
      isCollapsed: true,
    });
  }
};

export const formatOnSave = async (activeFilePath: string) => {
  try {
    const file = await db.files.get(activeFilePath);
    if (!file) return;
    if (file.language !== 'lua') return;
    const config = Config.new();

    const formattedCode = await formatCode(file.content, config, undefined, 1);
    await db.files.update(activeFilePath, { content: formattedCode });
  } catch (error) {
    throw new Error(String(error));
  }
};

export const closeTab = async (activeFilePath: string) => {
  try {
    await db.tabs.delete(activeFilePath);
  } catch (error) {
    throw new Error('Failed to close tab');
  }
};

export const AOS_ASCII = `
           _____                   _______                   _____            
          /\\    \\                 /::\\    \\                 /\\    \\           
         /::\\    \\               /::::\\    \\               /::\\    \\          
        /::::\\    \\             /::::::\\    \\             /::::\\    \\         
       /::::::\\    \\           /::::::::\\    \\           /::::::\\    \\        
      /:::/\\:::\\    \\         /:::/~~\\:::\\    \\         /:::/\\:::\\    \\       
     /:::/__\\:::\\    \\       /:::/    \\:::\\    \\       /:::/__\\:::\\    \\      
    /::::\\   \\:::\\    \\     /:::/    / \\:::\\    \\      \\:::\\   \\:::\\    \\     
   /::::::\\   \\:::\\    \\   /:::/____/   \\:::\\____\\   ___\\:::\\   \\:::\\    \\    
  /:::/\\:::\\   \\:::\\    \\ |:::|    |     |:::|    | /\\   \\:::\\   \\:::\\    \\   
 /:::/  \\:::\\   \\:::\\____\\|:::|____|     |:::|    |/::\\   \\:::\\   \\:::\\____\\  
 \\::/    \\:::\\  /:::/    / \\:::\\    \\   /:::/    / \\:::\\   \\:::\\   \\::/    /  
  \\/____/ \\:::\\/:::/    /   \\:::\\    \\ /:::/    /   \\:::\\   \\:::\\   \\/____/   
           \\::::::/    /     \\:::\\    /:::/    /     \\:::\\   \\:::\\    \\       
            \\::::/    /       \\:::\\__/:::/    /       \\:::\\   \\:::\\____\\      
            /:::/    /         \\::::::::/    /         \\:::\\  /:::/    /      
           /:::/    /           \\::::::/    /           \\:::\\/:::/    /       
          /:::/    /             \\::::/    /             \\::::::/    /        
         /:::/    /               \\::/____/               \\::::/    /         
         \\::/    /                 ~~                      \\::/    /          
          \\/____/                                           \\/____/           
                                                                       
`;
