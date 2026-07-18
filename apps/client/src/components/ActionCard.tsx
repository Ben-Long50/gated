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
import WeaponIcon from './icons/WeaponIcon';
import CyberIcon from './icons/CyberIcon';
import ArmorIcon from './icons/ArmorIcon';
import InventoryIcon from './icons/InventoryIcon';
import DroneIcon from './icons/DroneIcon';
import PotionIcon from './icons/PotionIcon';
import ModificationIcon from './icons/ModificationIcon';
import ArrowHeader4 from './ArrowHeader4';

const ActionCard = ({
  actionId,
  expanded = false,
  child = false,
  size = 'small',
}: {
  actionId: number;
  size: 'small' | 'large';
  child?: boolean;
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
      child={child}
      cardRef={cardRef}
      heading={
        <div className={`flex w-full items-center gap-4 pr-2`}>
          <div className="flex grow items-center gap-2">
            <h3>{action?.name}</h3>
            <p className="text-tertiary text-base font-semibold">
              ({capitalCase(action?.actionType)})
            </p>
          </div>
          {action?.itemLink && (
            <button
              className="group flex items-center gap-2"
              onClick={() =>
                navigate(`/glam/codex/items/${action?.itemLink?.item.id}`)
              }
            >
              <p className="group-hover:text-accent timing text-right text-base">
                {action?.itemLink.item.name}
              </p>
              {action?.itemLink.item.itemTypes.includes('weapon') && (
                <WeaponIcon className="group-hover:text-accent size-6" />
              )}
              {action?.itemLink.item.itemTypes.includes('armor') && (
                <ArmorIcon className="group-hover:text-accent size-6" />
              )}
              {action?.itemLink.item.itemTypes.includes('cybernetic') && (
                <CyberIcon className="group-hover:text-accent size-6" />
              )}
              {action?.itemLink.item.itemTypes.includes('drone') && (
                <DroneIcon className="group-hover:text-accent size-6" />
              )}
              {action?.itemLink.item.itemTypes.includes('reusable') && (
                <InventoryIcon className="group-hover:text-accent size-6" />
              )}
              {action?.itemLink.item.itemTypes.includes('consumable') && (
                <PotionIcon className="group-hover:text-accent size-6" />
              )}
              {action?.itemLink.item.itemTypes.includes('modification') && (
                <ModificationIcon className="group-hover:text-accent size-6" />
              )}
            </button>
          )}

          {(user.role === 'ADMIN' || user.role === 'SUPERADMIN') && (
            <button
              className="text-accent hover:underline"
              onClick={() =>
                navigate(`/glam/codex/actions/${action?.id}/update`)
              }
            >
              Edit
            </button>
          )}
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
            <ArrowHeader4 title="Costs" className="text-primary" />
            <StatBarContainer size={size}>
              <ActionStatBars stats={action?.costs} size={size} />
            </StatBarContainer>
          </div>
        )}
        <p>{description1}</p>
        {action?.modifiers && Object.keys(action?.modifiers).length > 0 && (
          <StatBarContainer size={size}>
            <CharacterStatBars size={size} stats={action?.modifiers} />
            <StatBars size={size} stats={action?.modifiers} />
          </StatBarContainer>
        )}
        {action?.keywordModifiers &&
          action?.keywordModifiers.length > 0 &&
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
