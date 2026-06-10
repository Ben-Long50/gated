import { FormApi } from '@tanstack/react-form';
import ActionCard from '../ActionCard';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';
import InputFieldCheckbox from './InputFieldCheckbox';

const ActionLinkField = ({ form, path }: { form: FormApi; path: string }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  return (
    <>
      {parts.includes('actions') && <Outlet context={{ form }} />}
      <form.Field name="actionIds">
        {(field) => (
          <div className="flex flex-col gap-4 md:grid md:grid-cols-2">
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
        )}
      </form.Field>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate(path || 'actions?mode=form');
        }}
      >
        Link Actions
      </BtnAuth>
    </>
  );
};

export default ActionLinkField;
