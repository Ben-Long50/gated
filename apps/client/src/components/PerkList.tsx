import PerkCard from './PerkCard';
import { Perk, PerkTree } from 'src/types/perk';
import { FormApi } from '@tanstack/react-form';
import { capitalCase } from 'change-case';
import ExpandingList from './ExpandingList';
import Divider from './Divider';

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
              {Object.entries(skills).map(([skill, perkList], index) => {
                {
                  return (
                    perkList.length > 0 && (
                      <>
                        <div className="flex flex-col gap-4" key={skill}>
                          <ExpandingList
                            title={
                              capitalCase(skill) + ' ' + `(${perkList.length})`
                            }
                            className="flex flex-col items-start gap-4 md:grid md:grid-cols-2"
                          >
                            {perkList.map((perk: Perk) => (
                              <PerkCard
                                key={perk.id}
                                perkId={perk.id}
                                form={form}
                              />
                            ))}
                          </ExpandingList>
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
