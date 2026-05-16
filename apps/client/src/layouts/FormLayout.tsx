import { ReactNode, useContext } from 'react';
import ThemeContainer from '../components/ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import { UseMutationResult } from '@tanstack/react-query';
import { FormApi, useStore } from '@tanstack/react-form';
import BtnAuth from 'src/components/buttons/BtnAuth';
import Loading from 'src/components/Loading';
import BtnRect from 'src/components/buttons/BtnRect';
import Divider from 'src/components/Divider';
import CharacterHeader from 'src/components/CharacterHeader';

type MutationType<TData = any, TVariables = any> = UseMutationResult<
  TData,
  unknown,
  TVariables
>;

const FormLayout = ({
  children,
  label,
  form,
  itemId,
  createMutation,
  deleteMutation,
}: {
  children: ReactNode;
  label: string;
  form: FormApi;
  itemId?: string;
  createMutation?: MutationType;
  deleteMutation?: MutationType;
}) => {
  const { accentPrimary } = useContext(ThemeContext);

  const formErrorMap = useStore(form.store, (state) => state.errorMap);

  const errorArray = formErrorMap.onSubmit
    ? formErrorMap.onSubmit.split(',')
    : [];

  const isPending = createMutation?.isPending || deleteMutation?.isPending;

  return (
    <form
      className="flex flex-col gap-8"
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!isPending) {
          form.handleSubmit();
        }
      }}
    >
      {children}
      <Divider className="mt-0.5" />
      <div className="flex w-full flex-col gap-4">
        {errorArray.length > 0 && (
          <div className="flex flex-col items-start gap-2">
            <em className="text-error text-xl">Errors:</em>
            {errorArray.map((error: string, index: number) => (
              <em className="text-error text-lg">{`${index + 1}. ${error}`}</em>
            ))}
          </div>
        )}
        <BtnRect
          ariaLabel={itemId ? `Update ${label}` : `Create ${label}`}
          type="submit"
          className="group w-full"
        >
          {isPending ? (
            <Loading
              className="group-hover:text-accent dark:text-gray-900"
              size={1.15}
            />
          ) : itemId ? (
            `Update ${label}`
          ) : (
            `Create ${label}`
          )}
        </BtnRect>
        <BtnAuth className="w-full" onClick={() => form.reset()}>
          Reset Form
        </BtnAuth>
        {itemId && (
          <BtnAuth
            className="w-full"
            onClick={() => deleteMutation?.mutate(Number(itemId))}
          >
            Delete
          </BtnAuth>
        )}
      </div>
    </form>
  );
};

export default FormLayout;
