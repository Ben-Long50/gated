import { FormApi, useStore } from '@tanstack/react-form';
import PerkCard from '../PerkCard';
import { AttributeTree } from 'src/types/attributeTree';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';
import InputFieldCheckbox from './InputFieldCheckbox';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import ArrowHeader2 from '../ArrowHeader2';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';

const PerkLinkField = ({
  form,
  level,
  attributeTree,
}: {
  form: FormApi;
  level: number;
  attributeTree: AttributeTree;
}) => {
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigateWithQuery();
  const location = useLocation();
  const parts = location.pathname.split('/');

  return (
    <>
      {parts.includes('perks') && (
        <Outlet context={{ form, level, attributeTree }} />
      )}
      <ArrowHeader2 title="Perks" />
      <form.Field name="perkIds">
        {(field) =>
          field.state.value.length > 0 && (
            <div
              className={`${mobile ? 'flex flex-col' : 'grid grid-cols-2'} gap-4`}
            >
              {field.state.value.map((perkId: number) => (
                <InputFieldCheckbox
                  label={<PerkCard perkId={perkId} />}
                  value={perkId}
                  checked={field.state.value.some(
                    (id: number) => perkId === id,
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
          navigate('perks?mode=form');
        }}
      >
        Link Perks
      </BtnAuth>
    </>
  );
};

export default PerkLinkField;
