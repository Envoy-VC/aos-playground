import { Header, HeaderDescription, HeaderTitle } from '~/components/ui/header';

import EditorConfigForm from './EditorConfigForm';
import ResetCache from './ResetCache';

const SettingsPanel = () => {
  return (
    <div className='flex flex-col gap-4 p-2'>
      <Header>
        <HeaderTitle>Settings</HeaderTitle>
        <HeaderDescription>
          Configure your settings, preferences, and more.
        </HeaderDescription>
      </Header>
      <EditorConfigForm />
      <ResetCache />
    </div>
  );
};

export default SettingsPanel;
