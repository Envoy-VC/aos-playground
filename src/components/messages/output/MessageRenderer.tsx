import React from 'react';
import * as prod from 'react/jsx-runtime';

import Ansi from 'ansi-to-react';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import { unified } from 'unified';

interface Props {
  message: string;
  prompt?: string;
}

const MessageRenderer = ({ message, prompt }: Props) => {
  const [Content, setContent] = React.useState<JSX.Element | string | null>(
    null
  );

  const renderJSX = async () => {
    try {
      const production = {
        Fragment: prod.Fragment,
        jsx: prod.jsx,
        jsxs: prod.jsxs,
      };

      const context = await unified()
        .use(rehypeParse, { fragment: true })
        // @ts-expect-error err
        .use(rehypeReact, production)
        .process(message);

      if (typeof context.result.props.children === 'string') {
        setContent(message);
        return;
      }
      setContent(context.result);
    } catch (error) {
      setContent(message);
    }
  };

  React.useEffect(() => {
    renderJSX();
  }, [message]);

  return (
    <div className='font-mono'>
      {prompt && <span className='text-blue-600 font-medium'>{prompt}</span>}
      {typeof Content === 'object' ? (
        <>{Content}</>
      ) : (
        <Ansi className='whitespace-pre-wrap'>{String(Content)}</Ansi>
      )}
    </div>
  );
};

export default MessageRenderer;
