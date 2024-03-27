import { Toast, useToast as useReactToast } from '~/components/ui/use-toast';

const useToast = () => {
  const { toast: reactToast } = useReactToast();

  const successToast = ({ ...props }: Toast) => {
    reactToast({
      variant: 'default',
      ...props,
    });
  };

  const errorToast = ({ ...props }: Toast) => {
    reactToast({
      variant: 'destructive',
      ...props,
    });
  };

  const toast = {
    success: successToast,
    error: errorToast,
  };

  return { toast };
};

export default useToast;
