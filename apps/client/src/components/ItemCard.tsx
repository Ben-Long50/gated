import { CSSProperties, Fragment, useContext, useRef } from 'react';
import ThemeContainer from './ThemeContainer';
import ItemRarity from './ItemRarity';
import { KeywordReference } from 'src/types/keyword';
import ItemPicture from './ItemPicture';
import ArrowHeader2 from './ArrowHeader2';
import StatBars from './StatBars';
import {
  ArmorControls,
  CyberneticControls,
  DroneControls,
  ItemControls,
  VehicleControls,
  WeaponControls,
} from './ItemCardControls';
import { AuthContext } from 'src/contexts/AuthContext';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiLinkBoxVariantOutline } from '@mdi/js';
import { useInView } from 'react-intersection-observer';
import KeywordTag from './KeywordTag';
import ConditionTag from './ConditionTag';
import { CampaignContext } from 'src/contexts/CampaignContext';
import StatBarContainer from './StatBarContainer';
import ActionCard from './ActionCard';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import { LayoutContext } from 'src/contexts/LayoutContext';
import rarityColorMap from 'src/utils/rarityColorMap';
import useItem from 'src/hooks/useItem';
import Loading from './Loading';
import useParts from 'src/hooks/useParts';

const ItemCard = ({
  itemId,
  className,
  style,
  size = 'large',
  onClick,
  ownerId,
}: {
  itemId: number;
  className?: string;
  style?: CSSProperties;
  menu?: boolean;
  size?: 'small' | 'large';
  onClick?: (value: number) => void;
  ownerId?: number;
}) => {
  const { gameMaster } = useContext(CampaignContext);
  const { mobile } = useContext(LayoutContext);
  const { user } = useContext(AuthContext);

  const { conditionId, traitId } = useParams();

  const { item, isLoading } = useItem(itemId);

  const navigate = useNavigate();
  const { parts } = useParts();

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerRef = useRef(null);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className={`${className} w-full`} ref={ref} style={style}>
      {inView && (
        <ThemeContainer
          chamfer="medium"
          className="group w-full"
          borderColor={rarityColorMap[item.rarity]}
        >
          <div
            ref={containerRef}
            className={`${mobile ? 'p-2' : 'p-4'} timing relative flex cursor-pointer flex-col`}
            onClick={(e) => {
              e.stopPropagation();
              if (onClick) {
                onClick(item.id);
              } else {
                if (parts.includes('shop')) {
                  if (parts.includes('modal')) {
                    parts.includes('items')
                      ? navigate(`${item.id}`)
                      : navigate(`items/${item.id}`);
                  } else {
                    parts.includes('items')
                      ? navigate(`${item.id}`)
                      : navigate(`modal/items/${item.id}`);
                  }
                } else {
                  parts.includes('items')
                    ? navigate(`${item.id}`)
                    : navigate(`items/${item.id}`);
                }
              }
            }}
          >
            <div
              className={`${size === 'small' ? 'flex-col' : 'max-h-[300px] flex-row'} flex w-full gap-8`}
            >
              <ItemPicture
                key={item.id}
                className={`${size === 'small' ? 'h-full' : 'h-[300px]'} timing group-hover:bg-secondary aspect-square`}
                item={item}
              />
              <div
                className={`${size === 'small' && 'max-h-[300px]'} scrollbar-primary-2 flex w-full flex-col gap-4 overflow-y-auto p-1 pr-3`}
              >
                <div className="flex w-full items-start justify-between gap-4">
                  <div className="flex w-full items-center gap-4">
                    <div className="flex items-center justify-between gap-4">
                      <ArrowHeader2 title={item.name} />
                      {item.baseItemId && (
                        <Link
                          className="timing group ml-auto flex items-center gap-4 py-2"
                          to={`/glam/codex/${item.itemTypes[0]}s/${item.baseItemId}`}
                        >
                          <Icon
                            path={mdiLinkBoxVariantOutline}
                            className="group-hover:text-accent timing text-tertiary size-8 shrink-0"
                          />
                        </Link>
                      )}
                    </div>
                    <div className="flex grow flex-wrap items-center justify-start gap-1">
                      {item.conditions?.map((condition) => (
                        <ConditionTag
                          key={condition.id}
                          condition={condition}
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div
                  className={`timing flex items-center justify-between gap-x-8 gap-y-2`}
                >
                  {item.keywords.length > 0 && (
                    <div className={`flex flex-wrap items-center gap-1`}>
                      {item.keywords.map((keyword: KeywordReference) => {
                        return (
                          <KeywordTag key={keyword.id} keyword={keyword} />
                        );
                      })}
                    </div>
                  )}
                  <ItemRarity
                    className="ml-auto"
                    rarity={item.rarity}
                    grade={item.grade}
                    size={size}
                  />
                </div>
                <StatBarContainer size={size}>
                  <StatBars size={size} stats={item.stats} />
                </StatBarContainer>
                {item.linkedActions.length > 0 && (
                  <div className="flex flex-col gap-4">
                    <Divider />
                    <ArrowHeader3 title="Unique Actions" />
                    {item.linkedActions.filter(Boolean).map((action) => (
                      <ActionCard
                        size={size}
                        actionId={action.id}
                        expanded={true}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
            {(parts.includes('equipment') ||
              parts.includes('deployments') ||
              parts.includes('maps')) &&
              (gameMaster || ownerId === user?.id) && (
                <div className="z-10">
                  {item.itemTypes.includes('weapon') ? (
                    <WeaponControls
                      weaponId={item.id}
                      stats={item.stats}
                      size={size}
                    />
                  ) : item.itemTypes.includes('armor') ? (
                    <ArmorControls
                      armorId={item.id}
                      stats={item.stats}
                      size={size}
                    />
                  ) : item.itemTypes.includes('cybernetic') ? (
                    <CyberneticControls
                      cyberneticId={item.id}
                      stats={item.stats}
                      size={size}
                    />
                  ) : item.itemTypes.includes('vehicle') ? (
                    <VehicleControls
                      vehicleId={item.id}
                      stats={item.stats}
                      size={size}
                    />
                  ) : item.itemTypes.includes('drone') ? (
                    <DroneControls
                      droneId={item.id}
                      stats={item.stats}
                      size={size}
                    />
                  ) : (
                    item.itemTypes.includes('reusable') && (
                      <ItemControls
                        itemId={item.id}
                        stats={item.stats}
                        size={size}
                      />
                    )
                  )}
                </div>
              )}
          </div>
        </ThemeContainer>
      )}
    </div>
  );
};

export default ItemCard;
