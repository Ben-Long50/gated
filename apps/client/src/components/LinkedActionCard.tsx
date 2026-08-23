import Icon from '@mdi/react';
import DieIcon from './icons/DieIcon';
import { mdiTriangleDown } from '@mdi/js';
import { Action } from 'src/types/action';
import StopwatchIcon from './icons/StopwatchIcon';
import { useRef } from 'react';
import ArrowHeader3 from './ArrowHeader3';
import ActionStatBars from './ActionStatBars';
import { capitalCase } from 'change-case';
import ActionRadialMenu from './radialMenus/ActionRadialMenu';
import ItemCardSmall from './ItemCardSmall';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import StatBarContainer from './StatBarContainer';
import CharacterStatBars from './characterComponents/CharacterStatBars';
import StatBars from './StatBars';
import Divider from './Divider';
import ArrowHeader4 from './ArrowHeader4';

const LinkedActionCard = ({
  action,
  size = 'small',
}: {
  action: Action;
  size: 'small' | 'large';
}) => {
  const containerRef = useRef(null);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const handleMenu = (e: MouseEvent) => {
    if (!containerRef.current) return;
    setMenu('action', 'large', action.id);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!menuOpen) {
      setCoordinates(x, y);
    }
    setMenuOpen(!menuOpen);
  };

  const costLength = action?.costs ? Object.keys(action.costs).length : 0;

  const description = action.description.split(/\[stats\]/);

  const description1 = description[0];
  const description2 = description[1];

  return (
    <div
      ref={containerRef}
      className={`flex cursor-pointer flex-col items-start justify-start gap-4`}
      onClick={(e) => {
        e.stopPropagation();
        handleMenu(e);
      }}
    >
      {action.parentItemId && (
        <ActionRadialMenu
          action={action}
          itemId={action.parentItemId}
          containerRef={containerRef}
        />
      )}
      <div className={`flex w-full items-center justify-start gap-4`}>
        <ArrowHeader3 title={action?.name} />
        <p className="text-tertiary text-base font-semibold">
          ({capitalCase(action.actionType)})
        </p>
        {action.duration?.unit && (
          <div className="ml-auto flex items-center gap-4">
            <StopwatchIcon className="text-secondary size-8" />
            <p>{action.duration?.value}</p>
            <p>{capitalCase(action.duration.unit)}</p>
          </div>
        )}
      </div>
      {action?.roll && action?.roll.length > 0 && (
        <div className="flex flex-col gap-2">
          {action.roll.map((roll, index) => (
            <div key={index} className="flex items-center gap-4">
              <DieIcon className="text-secondary size-8" />
              <p className="font-semibold">{capitalCase(roll.attribute)}</p>
              <Icon
                className="text-secondary"
                path={mdiTriangleDown}
                size={0.35}
                rotate={-90}
              />
              <p>{capitalCase(roll.skill)}</p>
            </div>
          ))}
        </div>
      )}
      <p>{description1}</p>
      {costLength > 0 && (
        <>
          <ArrowHeader4 className="text-secondary" title="Costs" />
          <StatBarContainer size={size}>
            <ActionStatBars stats={action.costs} size={size} />
          </StatBarContainer>
        </>
      )}
      {((action.modifiers && Object.keys(action.modifiers).length > 0) ||
        action.keywordModifiers.length > 0) && (
        <>
          <Divider />
          <ArrowHeader4 className="text-primary" title="Modifiers" />
          {action?.modifiers && Object.keys(action?.modifiers).length > 0 && (
            <StatBarContainer size={size}>
              <CharacterStatBars stats={action?.modifiers} size={size} />
              <StatBars stats={action?.modifiers} size={size} />
            </StatBarContainer>
          )}
          <div className="grid w-full grid-cols-1 gap-4 sm:grid-cols-2">
            {action.keywordModifiers &&
              action.keywordModifiers.length > 0 &&
              action.keywordModifiers.map((keyword, index) => (
                <ItemCardSmall
                  key={index}
                  className={`${index !== action.keywordModifiers.length - 1 && 'mr-1'} bg-tertiary`}
                  heading={<h4>{keyword.keyword.name}</h4>}
                >
                  <p>{keyword.keyword.description}</p>
                </ItemCardSmall>
              ))}
          </div>
        </>
      )}
      {description2 && <p>{description2}</p>}
    </div>
  );
};

export default LinkedActionCard;
