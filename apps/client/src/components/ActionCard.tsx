import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import DieIcon from './icons/DieIcon';
import ItemCardSmall from './ItemCardSmall';
import Icon from '@mdi/react';
import { mdiTriangleDown } from '@mdi/js';
import ActionStatBars from './ActionStatBars';
import { capitalCase } from 'change-case';
import StatBarContainer from './StatBarContainer';
import CharacterStatBars from './characterComponents/CharacterStatBars';
import useActionQuery from 'src/hooks/useActionQuery/useActionQuery';
import Loading from './Loading';
import StatBars from './StatBars';

const ActionCard = ({
  actionId,
  expanded,
}: {
  actionId: number;
  expanded?: boolean;
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const cardRef = useRef(null);

  const { data: action, isLoading } = useActionQuery(Number(actionId));

  const costLength = action?.costs ? Object.keys(action?.costs).length : 0;

  const description = action?.description.split(/\[stats\]/);

  const description1 = action ? description[0] : undefined;
  const description2 = action ? description[1] : undefined;

  return isLoading ? (
    <Loading size={1.15} />
  ) : (
    <ItemCardSmall
      expanded={expanded}
      cardRef={cardRef}
      heading={
        <div className={`flex w-full items-center justify-between gap-4 pr-2`}>
          <div className="flex items-center gap-2">
            <h3 className="grow">{action?.name}</h3>
            <p className="text-tertiary text-base font-semibold">
              ({capitalCase(action?.actionType)})
            </p>
          </div>
          {action?.itemLink && (
            <p className="text-right">{action?.itemLink.item.name}</p>
          )}

          {user.role === 'ADMIN' ||
            (user.role === 'SUPERADMIN' && (
              <button
                className="text-accent hover:underline"
                onClick={() =>
                  navigate(`/glam/codex/actions/${action?.id}/update`)
                }
              >
                Edit
              </button>
            ))}
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {action?.roll && action?.roll.length > 0 && (
          <div className="flex flex-col gap-2">
            {action?.roll.map(
              (roll: { attribute: string; skill: string }, index: number) => (
                <div key={index} className="flex items-center gap-4">
                  <DieIcon className="text-secondary size-8" />
                  <p className="font-semibold">
                    {roll.attribute ? capitalCase(roll.attribute) : undefined}
                  </p>
                  {roll.skill && (
                    <>
                      <Icon
                        className="text-secondary"
                        path={mdiTriangleDown}
                        size={0.35}
                        rotate={-90}
                      />
                      <p>{roll.skill ? capitalCase(roll.skill) : undefined}</p>
                    </>
                  )}
                </div>
              ),
            )}
          </div>
        )}
        {costLength > 0 && (
          <div className="flex w-full flex-col justify-start gap-2">
            <p className="text-accent text-base tracking-widest">Costs</p>
            <StatBarContainer>
              <ActionStatBars
                stats={action?.costs}
                cardWidth={cardRef.current?.offsetWidth}
              />
            </StatBarContainer>
          </div>
        )}
        <p>{description1}</p>
        {action?.modifiers && Object.keys(action?.modifiers).length > 0 && (
          <StatBarContainer>
            <CharacterStatBars stats={action?.modifiers} />
            <StatBars stats={action?.modifiers} />
          </StatBarContainer>
        )}
        {action?.keywordModifiers?.length > 0 &&
          action?.keywordModifiers.map((keyword, index) => (
            <ItemCardSmall
              key={index}
              className={`${index !== action?.keywordModifiers.length - 1 && 'mr-1'} bg-tertiary`}
              heading={<h4>{keyword.keyword?.name}</h4>}
            >
              <p>{keyword.keyword?.description}</p>
            </ItemCardSmall>
          ))}
        {description2 && <p>{description2}</p>}
      </div>
    </ItemCardSmall>
  );
};

export default ActionCard;
