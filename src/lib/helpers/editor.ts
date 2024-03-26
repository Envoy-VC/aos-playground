// @ts-expect-error err
import { Config, formatCode } from '$/stylua_lib_bg';

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
      return 'plaintext';
    default:
      return 'plaintext';
  }
};

export const getFileIcon = (fileName: string) => {
  const extension = fileName.split('.').pop();

  switch (extension) {
    case 'js':
      return 'https://cdn-icons-png.flaticon.com/512/5968/5968292.png';
    case 'lua':
      return 'https://icons.veryicon.com/png/o/file-type/file-type-icon-library/lua.png';
    case 'ts':
      return 'https://cdn-icons-png.flaticon.com/512/5968/5968381.png';
    case 'jsx':
      return 'https://cdn-icons-png.flaticon.com/512/875/875209.png';
    case 'tsx':
      return 'https://cdn-icons-png.flaticon.com/512/3459/3459528.png';
    default:
      return null;
  }
};

export const onCreate = async (
  parentFolder: string,
  name: string,
  isCreating: 'file' | 'folder'
) => {
  if (name.trim() === '') {
    return;
  }

  const type = isCreating === 'file' ? 'file' : 'folder';
  if (type === 'file') {
    const extension = name.split('.').pop() ?? null;
    if (!extension) {
      return;
    }
    if (!supportedExtensions.includes(extension)) {
      return;
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
