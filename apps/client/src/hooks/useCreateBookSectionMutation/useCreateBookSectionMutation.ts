import { useMutation, useQueryClient } from '@tanstack/react-query';
import createBookSection from './createBookSection';

const useCreateBookSectionMutation = (
  setFormMessage: (message: string) => void,
) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (formData: object) => {
      return createBookSection(formData);
    },
    onSuccess: () => {
      setFormMessage('Book section successfully created');
      return queryClient.invalidateQueries({
        queryKey: ['book'],
        exact: false,
      });
    },
    onError: (error) => {
      setFormMessage(error.message);
    },
    throwOnError: false,
  });
};

export default useCreateBookSectionMutation;
