import { mdiCircle } from '@mdi/js';
import Icon from '@mdi/react';
import { AttributeTree } from 'src/types/attributeTree';

const AttributeListSmall = ({
  attributeTree,
}: {
  attributeTree: AttributeTree;
}) => {
  const attributes = Object.entries(attributeTree)
    .map(([attribute, { points }]) => [attribute, points])
    .filter(([_, points]) => points > 0);

  const skills = Object.values(attributeTree).flatMap(({ skills }) =>
    Object.entries(skills)
      .map(([skill, points]) => [skill, points.points])
      .filter(([_, points]) => points > 0),
  );

  return (
    <div className="ml-auto flex flex-col items-end justify-center gap-1">
      {attributes.map(([attribute, points]) => {
        return (
          <div className="flex items-center gap-2" key={attribute}>
            {Array.from({ length: points }).map((_, index) => (
              <Icon
                key={index}
                path={mdiCircle}
                className="text-accent size-6"
              />
            ))}
          </div>
        );
      })}
      {skills.map(([skill, points]) => {
        return (
          <div className="flex items-center gap-1" key={skill}>
            {points === 4 ? (
              <p className="font-zen font-semibold italic tracking-widest">
                Master
              </p>
            ) : (
              Array.from({ length: points }).map((_, index) => (
                <Icon
                  key={index}
                  path={mdiCircle}
                  className="text-secondary size-4 shrink-0"
                />
              ))
            )}
          </div>
        );
      })}
    </div>
  );
};

export default AttributeListSmall;
