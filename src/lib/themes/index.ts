import type * as monaco from 'monaco-editor';

export const darkTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    {
      background: '1C1E28',
      token: '',
    },
    {
      foreground: '969896',
      token: 'comment',
    },
    {
      foreground: 'ced1cf',
      token: 'keyword.operator.class',
    },
    {
      foreground: 'ced1cf',
      token: 'constant.other',
    },
    {
      foreground: 'ced1cf',
      token: 'source.php.embedded.line',
    },
    {
      foreground: 'cc6666',
      token: 'variable',
    },
    {
      foreground: 'cc6666',
      token: 'support.other.variable',
    },
    {
      foreground: 'cc6666',
      token: 'string.other.link',
    },
    {
      foreground: 'cc6666',
      token: 'string.regexp',
    },
    {
      foreground: 'cc6666',
      token: 'entity.name.tag',
    },
    {
      foreground: 'cc6666',
      token: 'entity.other.attribute-name',
    },
    {
      foreground: 'cc6666',
      token: 'meta.tag',
    },
    {
      foreground: 'cc6666',
      token: 'declaration.tag',
    },
    {
      foreground: 'cc6666',
      token: 'markup.deleted.git_gutter',
    },
    {
      foreground: 'de935f',
      token: 'constant.numeric',
    },
    {
      foreground: 'de935f',
      token: 'constant.language',
    },
    {
      foreground: 'de935f',
      token: 'support.constant',
    },
    {
      foreground: 'de935f',
      token: 'constant.character',
    },
    {
      foreground: 'de935f',
      token: 'variable.parameter',
    },
    {
      foreground: 'de935f',
      token: 'punctuation.section.embedded',
    },
    {
      foreground: 'de935f',
      token: 'keyword.other.unit',
    },
    {
      foreground: 'f0c674',
      token: 'entity.name.class',
    },
    {
      foreground: 'f0c674',
      token: 'entity.name.type.class',
    },
    {
      foreground: 'f0c674',
      token: 'support.type',
    },
    {
      foreground: 'f0c674',
      token: 'support.class',
    },
    {
      foreground: 'b5bd68',
      token: 'string',
    },
    {
      foreground: 'b5bd68',
      token: 'constant.other.symbol',
    },
    {
      foreground: 'b5bd68',
      token: 'entity.other.inherited-class',
    },
    {
      foreground: 'b5bd68',
      token: 'markup.heading',
    },
    {
      foreground: 'b5bd68',
      token: 'markup.inserted.git_gutter',
    },
    {
      foreground: '8abeb7',
      token: 'keyword.operator',
    },
    {
      foreground: '8abeb7',
      token: 'constant.other.color',
    },
    {
      foreground: '81a2be',
      token: 'entity.name.function',
    },
    {
      foreground: '81a2be',
      token: 'meta.function-call',
    },
    {
      foreground: '81a2be',
      token: 'support.function',
    },
    {
      foreground: '81a2be',
      token: 'keyword.other.special-method',
    },
    {
      foreground: '81a2be',
      token: 'meta.block-level',
    },
    {
      foreground: '81a2be',
      token: 'markup.changed.git_gutter',
    },
    {
      foreground: 'b294bb',
      token: 'keyword',
    },
    {
      foreground: 'b294bb',
      token: 'storage',
    },
    {
      foreground: 'b294bb',
      token: 'storage.type',
    },
    {
      foreground: 'b294bb',
      token: 'entity.name.tag.css',
    },
    {
      foreground: 'ced2cf',
      background: 'df5f5f',
      token: 'invalid',
    },
    {
      foreground: 'ced2cf',
      background: '82a3bf',
      token: 'meta.separator',
    },
    {
      foreground: 'ced2cf',
      background: 'b798bf',
      token: 'invalid.deprecated',
    },
    {
      foreground: 'ffffff',
      token: 'markup.inserted.diff',
    },
    {
      foreground: 'ffffff',
      token: 'markup.deleted.diff',
    },
    {
      foreground: 'ffffff',
      token: 'meta.diff.header.to-file',
    },
    {
      foreground: 'ffffff',
      token: 'meta.diff.header.from-file',
    },
    {
      foreground: '718c00',
      token: 'markup.inserted.diff',
    },
    {
      foreground: '718c00',
      token: 'meta.diff.header.to-file',
    },
    {
      foreground: 'c82829',
      token: 'markup.deleted.diff',
    },
    {
      foreground: 'c82829',
      token: 'meta.diff.header.from-file',
    },
    {
      foreground: 'ffffff',
      background: '4271ae',
      token: 'meta.diff.header.from-file',
    },
    {
      foreground: 'ffffff',
      background: '4271ae',
      token: 'meta.diff.header.to-file',
    },
    {
      foreground: '3e999f',
      fontStyle: 'italic',
      token: 'meta.diff.range',
    },
  ],
  colors: {
    'editor.foreground': '#C5C8C6',
    'editor.background': '#1C1E28',
    'editor.selectionBackground': '#373B41',
    'editor.lineHighlightBackground': '#282A2E',
    'editorCursor.foreground': '#AEAFAD',
    'editorWhitespace.foreground': '#4B4E55',
    'editorGutter.background': '#21232f',
  },
};

export const lightTheme: monaco.editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    {
      background: 'ffffff',
      token: '',
    },
    {
      foreground: '009933',
      token: 'string',
    },
    {
      foreground: '0066ff',
      token: 'constant.numeric',
    },
    {
      foreground: 'ff0080',
      token: 'string.regexp',
    },
    {
      foreground: '0000ff',
      token: 'keyword',
    },
    {
      foreground: '9700cc',
      token: 'constant.language',
    },
    {
      foreground: '990000',
      token: 'support.class.exception',
    },
    {
      foreground: 'ff8000',
      token: 'entity.name.function',
    },
    {
      fontStyle: 'bold underline',
      token: 'entity.name.type',
    },
    {
      fontStyle: 'italic',
      token: 'variable.parameter',
    },
    {
      foreground: '0066ff',
      fontStyle: 'italic',
      token: 'comment',
    },
    {
      foreground: 'ff0000',
      background: 'e71a114d',
      token: 'invalid',
    },
    {
      background: 'e71a1100',
      token: 'invalid.deprecated.trailing-whitespace',
    },
    {
      foreground: '000000',
      background: 'fafafafc',
      token: 'text source',
    },
    {
      foreground: '0033cc',
      token: 'meta.tag',
    },
    {
      foreground: '0033cc',
      token: 'declaration.tag',
    },
    {
      foreground: '6782d3',
      token: 'constant',
    },
    {
      foreground: '6782d3',
      token: 'support.constant',
    },
    {
      foreground: '3333ff',
      fontStyle: 'bold',
      token: 'support',
    },
    {
      fontStyle: 'bold',
      token: 'storage',
    },
    {
      fontStyle: 'bold underline',
      token: 'entity.name.section',
    },
    {
      foreground: '000000',
      fontStyle: 'bold',
      token: 'entity.name.function.frame',
    },
    {
      foreground: '333333',
      token: 'meta.tag.preprocessor.xml',
    },
    {
      foreground: '3366cc',
      fontStyle: 'italic',
      token: 'entity.other.attribute-name',
    },
    {
      fontStyle: 'bold',
      token: 'entity.name.tag',
    },
  ],
  colors: {
    'editor.foreground': '#000000',
    'editor.background': '#ffffff',
    'editor.selectionBackground': '#BAD6FD',
    'editor.lineHighlightBackground': '#0000001A',
    'editorCursor.foreground': '#000000',
    'editorWhitespace.foreground': '#B3B3B3F4',
    'editorGutter.background': '#f9f9f9',
  },
};
