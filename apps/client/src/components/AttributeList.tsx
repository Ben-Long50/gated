import { mdiSquare } from '@mdi/js';
import Icon from '@mdi/react';
import { AttributeTree } from 'src/types/attributeTree';
import ArrowHeader4 from './ArrowHeader4';
import { capitalCase } from 'change-case';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';

const AttributeList = ({ attributeTree }: { attributeTree: AttributeTree }) => {
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <div className="grid grid-cols-[auto,_1fr] gap-4">
      {Object.entries(attributeTree)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([attribute, { points, skills }]) => (
          <>
            {points > 0 && (
              <>
                <ArrowHeader4 title={capitalCase(attribute)} />
                <div className="flex gap-2 justify-self-start">
                  {Array.from({ length: points }).map((_, index) => (
                    <Icon
                      key={index}
                      path={mdiSquare}
                      size={1}
                      color={accentPrimary}
                    />
                  ))}
                </div>
              </>
            )}
            {Object.entries(skills)
              .sort(([a], [b]) => a.localeCompare(b))
              .map(
                ([skill, { points }]) =>
                  points > 0 && (
                    <>
                      <ArrowHeader4 title={capitalCase(skill)} />
                      <div className="flex gap-2 justify-self-start">
                        {Array.from({ length: points }).map((_, index) => (
                          <Icon
                            className="text-primary"
                            key={index}
                            path={mdiSquare}
                            size={1}
                          />
                        ))}
                      </div>
                    </>
                  ),
              )}
          </>
        ))}
    </div>
  );
};

export default AttributeList;
