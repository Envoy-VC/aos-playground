import React from 'react';
import { renderToString } from 'react-dom/server';
import { JSX } from 'react/jsx-runtime';

import rehypeFormat from 'rehype-format';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import rehypeStringify from 'rehype-stringify';
import { unified } from 'unified';

export const safeRenderToString = (Element: JSX.Element) => {
  const reactHtml = renderToString(Element);
  const htmlAst = unified()
    .use(rehypeParse, { fragment: true })
    .parse(reactHtml);

  const createElement = React.createElement.bind(React);

  const unifiedAst = unified()
    // @ts-expect-error err
    .use(rehypeReact, { createElement })
    .runSync(htmlAst);

  const finalHtml = unified()
    .use(rehypeStringify)

    .use(rehypeFormat)
    // @ts-expect-error err
    .stringify(unifiedAst);

  return finalHtml;
};
