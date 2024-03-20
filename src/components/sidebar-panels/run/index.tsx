import { Header, HeaderTitle, HeaderDescription } from '~/components/ui/header';
import TagForm from './TagForm';

const RunDebugPanel = () => {
  return (
    <div className='flex flex-col gap-4 p-2'>
      <Header>
        <HeaderTitle>Run & Debug</HeaderTitle>
        <HeaderDescription>
          Run and debug your processes, add Data, Tags, and more.
        </HeaderDescription>
      </Header>
      <div className='flex flex-col'>
        <TagForm />
      </div>
    </div>
  );
};

export default RunDebugPanel;
