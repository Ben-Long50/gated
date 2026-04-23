import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';
import { User } from 'src/types/user';

const useAccountSettingsForm = (
  mutation: UseMutationResult<any, Error, any>,
  account?: Partial<User>,
) => {
  const accountForm = useForm({
    defaultValues: {
      username: account?.username ?? '',
      firstName: account?.firstName ?? '',
      lastName: account?.lastName ?? '',
      email: account?.email ?? '',
      password: '',
    },
    onSubmit: ({ value }) => {
      mutation.mutate(value);
    },
  });

  return accountForm;
};

export default useAccountSettingsForm;
