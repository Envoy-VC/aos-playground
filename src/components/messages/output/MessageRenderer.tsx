import Ansi from 'ansi-to-react';

interface Props {
  message: string;
  prompt?: string;
}

const MessageRenderer = ({ message, prompt }: Props) => {
  return (
    <div className='font-mono'>
      {prompt && <span>{prompt}</span>}
      <Ansi className=' whitespace-pre-line'>{String(message)}</Ansi>
    </div>
  );
};

export default MessageRenderer;
