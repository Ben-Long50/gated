import { useForm } from '@tanstack/react-form';
import { UseMutationResult } from '@tanstack/react-query';

const useUserRoleForm = (mutation: UseMutationResult<any, Error, any>) => {
  const userRoleForm = useForm({
    defaultValues: {
      users: [] as {
        id: number;
        username: string;
        profilePicture: string;
        role: string;
      }[],
    },
    onSubmit: ({ value }) => {
      const userData = value.users.map((user) => ({
        id: user.id,
        role: user.role,
      }));

      mutation.mutate(userData);
    },
  });

  return userRoleForm;
};

export default useUserRoleForm;
