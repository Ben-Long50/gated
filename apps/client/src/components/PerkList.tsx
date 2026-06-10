import PerkCard from './PerkCard';
import { Perk, PerkTree } from 'src/types/perk';
import { FormApi } from '@tanstack/react-form';
import { capitalCase } from 'change-case';
import ExpandingList from './ExpandingList';
import Divider from './Divider';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';

const PerkList = ({
  form,
  perkTree,
}: {
  form?: FormApi;
  perkTree: Partial<PerkTree>;
}) => {
  return (
    <>
      {Object.entries(perkTree).map(([perkType, skills]) => {
        return (
          Object.entries(skills).reduce(
            (accumulator, [_, perkList]) => accumulator + perkList.length,
            0,
          ) > 0 && (
            <div key={perkType} className="flex flex-col gap-8">
              {Object.entries(skills).map(([skill, perkList]) => {
                {
                  return (
                    perkList.length > 0 && (
                      <>
                        <div className="flex flex-col gap-4" key={skill}>
                          {form ? (
                            <form.Field name="perkIds">
                              {(field) => (
                                <ExpandingList
                                  title={
                                    capitalCase(skill) +
                                    ' ' +
                                    `(${perkList.length})`
                                  }
                                  className="flex flex-col items-start gap-4 md:grid md:grid-cols-2"
                                >
                                  {perkList.map((perk: Perk) => (
                                    <InputFieldCheckbox
                                      label={<PerkCard perkId={perk.id} />}
                                      value={perk.id}
                                      checked={field.state.value.some(
                                        (id: number) => perk.id === id,
                                      )}
                                      onChange={(value) => {
                                        if (
                                          !field.state.value.includes(
                                            Number(value),
                                          )
                                        ) {
                                          field.handleChange([
                                            ...field.state.value,
                                            Number(value),
                                          ]);
                                        } else {
                                          field.handleChange(
                                            field.state.value.filter(
                                              (id: number) =>
                                                id !== Number(value),
                                            ),
                                          );
                                        }
                                      }}
                                    />
                                  ))}
                                </ExpandingList>
                              )}
                            </form.Field>
                          ) : (
                            <ExpandingList
                              title={
                                capitalCase(skill) +
                                ' ' +
                                `(${perkList.length})`
                              }
                              className="flex flex-col items-start gap-4 md:grid md:grid-cols-2"
                            >
                              {perkList.map((perk: Perk) => (
                                <PerkCard key={perk.id} perkId={perk.id} />
                              ))}
                            </ExpandingList>
                          )}
                        </div>
                        <Divider />
                      </>
                    )
                  );
                }
              })}
            </div>
          )
        );
      })}
    </>
  );
};

export default PerkList;
