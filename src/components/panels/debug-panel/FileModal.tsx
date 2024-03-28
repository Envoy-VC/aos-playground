import { Dialog, DialogContent } from '~/components/ui/dialog';

import { RequireFile } from '~/types';

import { RenderJSON } from '.';

interface Props {
  isOpen: boolean;
  onOpenChange: (v: boolean) => void;
  file: RequireFile | null;
}

const FileModal = ({ isOpen, onOpenChange, file }: Props) => {
  return (
    <div>
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className='overflow-scroll max-h-[75dvh] max-w-screen-lg p-2'>
          <RenderJSON code={JSON.stringify(file?.ast, null, 2) ?? ''} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FileModal;
