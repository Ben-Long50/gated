import { FormApi } from '@tanstack/react-form';
import PerkCard from '../PerkCard';
import { AttributeTree } from 'src/types/attributeTree';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';
import InputFieldCheckbox from './InputFieldCheckbox';

const PerkLinkField = ({
  form,
  path,
  attributeTree,
}: {
  form: FormApi;
  path: string;
  attributeTree: AttributeTree;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  return (
    <>
      {parts.includes('perks') && <Outlet context={{ form, attributeTree }} />}
      <form.Field name="perkIds">
        {(field) => (
          <div className="flex flex-col items-start gap-4 md:grid md:grid-cols-2">
            {field.state.value.map((perkId: number) => (
              <InputFieldCheckbox
                label={<PerkCard perkId={perkId} />}
                value={perkId}
                checked={field.state.value.some((id: number) => perkId === id)}
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
          navigate(path || 'perks?mode=form');
        }}
      >
        Link Perks
      </BtnAuth>
    </>
  );
};

export default PerkLinkField;
