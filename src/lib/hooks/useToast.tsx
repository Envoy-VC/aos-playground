import { useToast as useReactToast } from '~/components/ui/use-toast';

const useToast = () => {
  const { toast: reactToast } = useReactToast();

  const successToast = (message: string) => {
    reactToast({
      title: message,
      variant: 'default',
    });
  };

  const errorToast = (message: string) => {
    reactToast({
      title: message,
      variant: 'destructive',
    });
  };

  const toast = {
    success: successToast,
    error: errorToast,
  };

  return { toast };
};

export default useToast;
