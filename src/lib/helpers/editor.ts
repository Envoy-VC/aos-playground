import { db } from '../db';

// prettier-ignore
export const supportedExtensions = ['js', 'ts', 'tsx', 'jsx', 'json', 'md', 'lua', 'py', 'txt'];

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
  console.log(`Creating ${type} ${name} in ${parentFolder}`);
  if (type === 'file') {
    const extension = name.split('.').pop() ?? null;
    if (!extension) {
      return;
    }
    if (!supportedExtensions.includes(extension)) {
      return;
    }
    const path = `${parentFolder}${name}`;

    await db.files.add({
      path,
      name,
      parentFolder,
      language: extensionToLanguage(extension),
      content: '',
    });
  } else {
    const path = `${parentFolder}${name}/`;
    // TODO: check if folder already exists
    // TODO: check for invalid characters
    await db.folders.add({
      path,
      name,
      parentFolder,
      isCollapsed: true,
    });
  }
};