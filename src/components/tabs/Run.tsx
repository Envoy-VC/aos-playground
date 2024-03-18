import React from 'react';

import { Button } from '../ui/button';
import { Play, LoaderCircle } from 'lucide-react';

import { useReadLocalStorage } from 'usehooks-ts';
import { db } from '~/lib/db';
// @ts-expect-error e
import luamin from 'luamin';

import { sendMessage } from '~/lib/services/message';

import { parse, Chunk, Statement, Expression } from 'luaparse';

import { useEditor } from '~/lib/stores';

import { Process } from '~/lib/db';
import { toast } from 'sonner';

export function resolveImports(
  ast: Chunk,
  fileContents: { [filePath: string]: string }
): Chunk {
  console.log('Entering resolveImports');
  ast.body = ast.body.flatMap((node: Statement) => {
    console.log('Processing node:', node.type);
    if (node.type === 'LocalStatement') {
      console.log('Handling LocalStatement');
      node.init.forEach((initExp: Expression) => {
        if (
          initExp.type === 'CallExpression' &&
          initExp.base.type === 'Identifier' &&
          initExp.base.name === 'require' &&
          initExp.arguments[0].type === 'StringLiteral'
        ) {
          console.log('Encountered require call in LocalStatement');
          const rawModulePath = initExp.arguments[0].raw; // Get the raw value of the argument
          const modulePath = rawModulePath.substring(
            1,
            rawModulePath.length - 1
          ); // Remove the surrounding quotes
          console.log('Module path:', modulePath);
          const resolvedFilePath = convertModulePathToFilePath(modulePath);
          console.log('Resolved file path:', resolvedFilePath);
          const resolvedContent = fileContents[resolvedFilePath];
          if (resolvedContent) {
            const resolvedAST = parse(resolvedContent);
            console.log('Resolved AST:', resolvedAST);
            return resolveImports(resolvedAST, fileContents).body; // Recursively resolve imports in the required module
          }
        }
      });
    } else if (node.type === 'CallStatement') {
      console.log('Handling CallStatement');
      if (node.expression.type === 'CallExpression') {
        console.log('Encountered CallExpression');
        const callExp = node.expression;
        if (
          callExp.base.type === 'Identifier' &&
          callExp.base.name === 'require' &&
          callExp.arguments[0].type === 'StringLiteral'
        ) {
          console.log('Encountered require call in CallStatement');
          const rawModulePath = callExp.arguments[0].raw; // Get the raw value of the argument
          const modulePath = rawModulePath.substring(
            1,
            rawModulePath.length - 1
          ); // Remove the surrounding quotes
          console.log('Module path:', modulePath);
          const resolvedFilePath = convertModulePathToFilePath(modulePath);
          console.log('Resolved file path:', resolvedFilePath);
          const resolvedContent = fileContents[resolvedFilePath];
          if (resolvedContent) {
            const resolvedAST = parse(resolvedContent);
            console.log('Resolved AST:', resolvedAST);
            return resolveImports(resolvedAST, fileContents).body; // Recursively resolve imports in the required module
          }
        }
      }
    }
    return node;
  });
  console.log('Exiting resolveImports');
  return ast;
}

function convertModulePathToFilePath(modulePath: string): string {
  if (modulePath.startsWith('.')) {
    return `${modulePath.substring(1)}.lua`; // Remove the leading dot and append .lua extension
  } else {
    return `${modulePath}.lua`; // Append .lua extension
  }
}

export const fileContents: { [filePath: string]: string } = {
  'index.lua': `
        local crypto = require(".crypto")

        -- this is a comment
        print(crypto)
        print(require(".crypto").version)
    `,
  'crypto.lua': `
        local crypto = {
            version = "0.0.1"
        }

        local third = require(".third")

        return crypto
    `,
  'third.lua': `
        local third = {
            text = "hello"
        }

        return third
    `,
};

const Run = () => {
  const { activePath } = useEditor();
  const [isSending, setIsSending] = React.useState<boolean>(false);

  const activeProcess = useReadLocalStorage<Process | undefined>(
    'activeProcess'
  );

  const send = async () => {
    try {
      if (!activeProcess) {
        throw new Error('No active process found');
      }
      const data = await db.files.get(activePath ?? '');
      if (!data) {
        throw new Error('File not found');
      }
      if (data.content === '') {
        throw new Error('File is empty');
      }
      setIsSending(true);
      // const parsed = parse(data.content, { scope: true });
      // const res = resolveImports(parsed, fileContents);

      // console.log(luamin.minify(res));
      await sendMessage({
        data: data.content,
        process: activeProcess.id,
      });
      toast.success('Message sent');
    } catch (error) {
      toast.error('', { description: (error as Error).message });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div>
      <Button
        size='sm'
        variant='ghost'
        className='gap-2'
        onClick={send}
        disabled={isSending}
      >
        {isSending ? (
          <LoaderCircle size={18} className='animate-spin' />
        ) : (
          <Play size={18} />
        )}
        Run
      </Button>
    </div>
  );
};

export default Run;
