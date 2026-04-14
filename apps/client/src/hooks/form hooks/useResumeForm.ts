import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { Resume } from 'src/types/character';
import constructFormData from './constructFormData';

const useResumeForm = (
  mutation: UseMutationResult<any, Error, FormData>,
  resume?: Resume,
) => {
  const resumeForm = useForm({
    defaultValues: {
      backstory: resume?.backstory ?? ({} as { html: string; nodes: object }),
      firstTaste: resume?.firstTaste ?? ({} as { html: string; nodes: object }),
      badMedicine:
        resume?.badMedicine ?? ({} as { html: string; nodes: object }),
    },
    onSubmit: async ({ value }) => {
      const formData = constructFormData(value);

      await mutation.mutate(formData);
    },
  });

  return resumeForm;
};

export default useResumeForm;
