import PerkCard from './PerkCard';
import { Perk, PerkTree } from 'src/types/perk';
import ArrowHeader2 from './ArrowHeader2';
import { FormApi } from '@tanstack/react-form';
import { capitalCase } from 'change-case';
import ExpandingList from './ExpandingList';

const PerkList = ({
  form,
  perkTree,
  className,
}: {
  form?: FormApi;
  perkTree: Partial<PerkTree>;
  className?: string;
}) => {
  return (
    <div className={`${className} z-20 flex w-full flex-col gap-8 px-0.5`}>
      {Object.entries(perkTree).map(([perkType, skills]) => {
        return (
          Object.entries(skills).reduce(
            (accumulator, [_, perkList]) => accumulator + perkList.length,
            0,
          ) > 0 && (
            <div key={perkType} className="flex flex-col gap-8 p-4 sm:p-8">
              <ArrowHeader2 title={capitalCase(perkType)} />
              {Object.entries(skills).map(([skill, perkList]) => {
                {
                  return (
                    perkList.length > 0 && (
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
                    )
                  );
                }
              })}
            </div>
          )
        );
      })}
    </div>
  );
};

export default PerkList;
