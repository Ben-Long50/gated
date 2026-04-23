import { FormApi, FormState } from '@tanstack/react-form';
import BtnRect from '../buttons/BtnRect';
import Icon from '@mdi/react';
import { mdiClose } from '@mdi/js';
import PerkCard from '../PerkCard';
import { AttributeTree } from 'src/types/attributeTree';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';

const PerkLinkField = ({
  form,
  attributeTree,
}: {
  form: FormApi;
  attributeTree: AttributeTree;
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  return (
    <>
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate('perks');
        }}
      >
        Link Perks
      </BtnAuth>
      <form.Subscribe selector={(state: FormState) => state.values.perkIds}>
        {(perkIds: number[]) => (
          <>
            <form.Field name="perks">
              {(field) => (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {parts[parts.length - 1] === 'perks' && (
                    <Outlet context={{ form, attributeTree, parts }} />
                  )}
                  {perkIds.map((perkId: number) => {
                    return (
                      <div className="flex items-center gap-2" key={perkId}>
                        <PerkCard perkId={perkId} />
                        <button
                          onClick={() => {
                            field.handleChange(
                              field.state.value.filter(
                                (id: number) => id !== perkId,
                              ),
                            );
                          }}
                        >
                          <Icon
                            path={mdiClose}
                            className="text-tertiary hover:text-accent timing size-10"
                          />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </form.Field>
          </>
        )}
      </form.Subscribe>
    </>
  );
};

export default PerkLinkField;
