import Ansi from 'ansi-to-react';

interface Props {
  message: string;
  prompt?: string;
}

const MessageRenderer = ({ message, prompt }: Props) => {
  return (
    <div className='font-mono'>
      {prompt && <span className='text-blue-600'>{prompt}</span>}
      <Ansi className=' whitespace-pre-line'>{String(message)}</Ansi>
    </div>
  );
};

export default MessageRenderer;
