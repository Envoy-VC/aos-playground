import CommandLoading from './CommandLoading';
import TerminalInput from './TerminalInput';

const Terminal = () => {
  return (
    <div className='h-full p-2 font-mono'>
      <div>Welcome message</div>
      <TerminalInput />
      <CommandLoading />
    </div>
  );
};

export default Terminal;
