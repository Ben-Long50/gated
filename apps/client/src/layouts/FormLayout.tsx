import { ReactNode, useContext } from 'react';
import ThemeContainer from '../components/ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import { UseMutationResult } from '@tanstack/react-query';
import { FormApi, useStore } from '@tanstack/react-form';
import BtnAuth from 'src/components/buttons/BtnAuth';
import Loading from 'src/components/Loading';
import BtnRect from 'src/components/buttons/BtnRect';
import Divider from 'src/components/Divider';

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

  const isPending = createMutation?.isPending || deleteMutation?.isPending;

  return (
    <ThemeContainer
      className="mb-auto w-full max-w-5xl"
      chamfer="large"
      borderColor={accentPrimary}
    >
      <form
        className="flex flex-col gap-8 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!isPending) {
            form.handleSubmit();
          }
        }}
      >
        <h1 className="w-full text-center">
          {itemId ? `Update ${label}` : `Create ${label}`}
        </h1>
        <Divider />
        {children}
        <Divider className="mt-0.5" />
        <div className="flex w-full flex-col gap-4">
          {formErrorMap.onSubmit &&
            typeof formErrorMap.onSubmit === 'string' && (
              <div>
                <em className="text-error">{formErrorMap.onSubmit}</em>
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
          <BtnAuth className="ml-auto w-full" onClick={() => form.reset()}>
            Reset Form
          </BtnAuth>
          {itemId && (
            <BtnAuth
              className="ml-auto w-1/3"
              onClick={() => deleteMutation?.mutate(Number(itemId))}
            >
              Delete
            </BtnAuth>
          )}
        </div>
      </form>
    </ThemeContainer>
  );
};

export default FormLayout;
