import { FormApi } from '@tanstack/react-form';
import ActionCard from '../ActionCard';
import BtnAuth from '../buttons/BtnAuth';
import InputFieldCheckbox from './InputFieldCheckbox';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ArrowHeader2 from '../ArrowHeader2';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';

const ActionLinkField = ({ form, path }: { form: FormApi; path?: string }) => {
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigateWithQuery();

  return (
    <>
      <ArrowHeader2 title="Actions" />
      <form.Field name="actionIds">
        {(field) =>
          field.state.value.length > 0 && (
            <div
              className={`${mobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}
            >
              {field.state.value.map((actionId: number) => (
                <InputFieldCheckbox
                  label={<ActionCard actionId={actionId} />}
                  value={actionId}
                  checked={field.state.value.some(
                    (id: number) => actionId === id,
                  )}
                  onChange={(value) => {
                    if (!field.state.value.includes(Number(value))) {
                      field.handleChange([...field.state.value, Number(value)]);
                    } else {
                      field.handleChange(
                        field.state.value.filter(
                          (id: number) => id !== Number(value),
                        ),
                      );
                    }
                  }}
                />
              ))}
            </div>
          )
        }
      </form.Field>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate(path || 'modal/actions?mode=form');
        }}
      >
        Link Actions
      </BtnAuth>
    </>
  );
};

export default ActionLinkField;
