import { CSSProperties, useContext, useEffect, useRef, useState } from 'react';
import ItemRarity from './ItemRarity';
import { KeywordReference } from '@gated/shared';
import { Item } from '@gated/shared';
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
import { useLocation, useOutletContext, useParams } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import KeywordTag from './KeywordTag';
import ConditionTag from './ConditionTag';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import { CampaignContext } from 'src/contexts/CampaignContext';

const ItemCardBorderless = ({
  item,
  className,
  style,
  mode,
  cardType,
  toggleFormLink,
  ownerId,
}: {
  item: Item;
  className?: string;
  style?: CSSProperties;
  mode?: string;
  cardType?: 'small' | 'large';
  toggleFormLink?: (item: Item) => void;
  ownerId?: number;
}) => {
  const { gameMaster } = useContext(CampaignContext);
  const { conditionId, traitId } = useParams();
  const { user } = useContext(AuthContext);
  const location = useLocation();
  const parts = location.pathname.split('/');
  const [cardWidth, setCardWidth] = useState(0);

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const { character } = useOutletContext() || {};

  const containerRef = useRef(null);
  const cardRef = useRef(null);

  const menuOpen = useRadialMenuStore((state) => state.menuOpen);
  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);
  const setMenu = useRadialMenuStore((state) => state.setMenu);
  const setCoordinates = useRadialMenuStore((state) => state.setCoordinates);

  const handleMenu = (e: MouseEvent) => {
    if (!containerRef.current) return;
    setMenu('item', 'large', item.id);

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (!menuOpen) {
      setCoordinates(x, y);
    }
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    if (cardRef.current) {
      setCardWidth(cardRef.current.offsetWidth);
    }
  }, [cardType, inView]);

  const keywordList = [...item?.keywords, ...item?.modifiedKeywords].sort(
    (a, b) => a.keyword.name.localeCompare(b.keyword.name),
  );

  const linkedWeapons =
    item.linkedItems.filter((item: Item) =>
      item.itemTypes.includes('weapon'),
    ) || [];
  const linkedArmors =
    item.linkedItems.filter((item: Item) => item.itemTypes.includes('armor')) ||
    [];
  const linkedVehicles =
    item.linkedItems.filter((item: Item) =>
      item.itemTypes.includes('vehicle'),
    ) || [];
  const uniqueActions = item.linkedActions || [];

  return (
    <div className={`${className}`} ref={ref} style={style}>
      {inView && (
        <div
          ref={containerRef}
          className={`timing relative flex w-full cursor-pointer flex-col gap-8 p-2`}
          onClick={(e) => {
            e.stopPropagation();
            handleMenu(e);
          }}
        >
          <div
            className={`${cardType === 'small' ? 'flex-col' : 'max-h-[300px] flex-row'} my-auto flex w-full gap-8`}
            onClick={
              mode === 'form' && toggleFormLink
                ? () => {
                    toggleFormLink(item);
                  }
                : undefined
            }
          >
            {cardType === 'large' && item.generatedPicture?.publicId && (
              <ItemPicture
                key={item.id}
                className={`timing aspect-square h-[300px]`}
                item={item}
              />
            )}
            <div className="flex w-full flex-col gap-4">
              <div className="flex w-full items-start justify-between gap-4">
                <div className="flex w-full items-center gap-4">
                  <div className="flex items-center justify-between gap-4">
                    <ArrowHeader2 title={item?.name} />
                  </div>
                  <div className="flex grow flex-wrap items-center justify-start gap-1">
                    {item.conditions?.map((condition) => (
                      <ConditionTag key={condition.id} condition={condition} />
                    ))}
                  </div>
                </div>
              </div>
              {cardType === 'small' && item.generatedPicture?.imageUrl && (
                <ItemPicture
                  key={item.id}
                  className={`timing aspect-square h-[300px]`}
                  item={item}
                />
              )}
              <div
                className={`timing flex items-center justify-between gap-x-8 gap-y-2`}
              >
                {keywordList.length > 0 && (
                  <div className={`flex flex-wrap items-center gap-1`}>
                    {keywordList.map((keyword: KeywordReference) => {
                      return <KeywordTag key={keyword.id} keyword={keyword} />;
                    })}
                  </div>
                )}
                <ItemRarity
                  className="ml-auto"
                  rarity={item?.rarity}
                  grade={item?.grade}
                  cardWidth={cardWidth}
                />
              </div>
              {item.stats && (
                <div
                  ref={cardRef}
                  className={`${cardWidth < 500 ? 'max-h-[200px] gap-2 px-2' : 'gap-4 px-4'} scrollbar-primary-2 grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-y-2 overflow-y-auto border-x-2 border-gray-400 border-opacity-50`}
                >
                  <StatBars
                    cardWidth={cardWidth}
                    stats={item.stats}
                    mode={mode}
                  />
                  {linkedWeapons.length > 0 && (
                    <>
                      <h4 className="col-span-3 justify-self-start">
                        Integrated Weapons
                      </h4>
                      <p className="min-w-6 text-center">
                        {linkedWeapons.length}
                      </p>
                    </>
                  )}
                  {linkedArmors.length > 0 && (
                    <>
                      <h4 className="col-span-3 justify-self-start">
                        Integrated Armors
                      </h4>
                      <p className="min-w-6 text-center">
                        {linkedArmors.length}
                      </p>
                    </>
                  )}
                  {linkedVehicles.length > 0 && (
                    <>
                      <h4 className="col-span-3 justify-self-start">
                        Supplied Vehicles
                      </h4>
                      <p className="min-w-6 text-center">
                        {linkedVehicles.length}
                      </p>
                    </>
                  )}
                  {uniqueActions.length > 0 && (
                    <>
                      <h4 className="col-span-3 justify-self-start">
                        Unique Actions
                      </h4>
                      <p className="min-w-6 text-center">
                        {uniqueActions.length}
                      </p>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
          {(parts.includes('equipment') ||
            parts.includes('deployments') ||
            parts.includes('maps')) && (
            <div className="z-10">
              {(gameMaster || ownerId === user?.id) &&
                (item.itemTypes.includes('weapon') ? (
                  <WeaponControls
                    weaponId={item.id}
                    stats={item.stats}
                    cardType={cardType}
                  />
                ) : item.itemTypes.includes('armor') ? (
                  <ArmorControls
                    armorId={item.id}
                    stats={item.stats}
                    cardType={cardType}
                  />
                ) : item.itemTypes.includes('augmentation') ? (
                  <CyberneticControls
                    cyberneticId={item.id}
                    stats={item.stats}
                    cardType={cardType}
                  />
                ) : item.itemTypes.includes('vehicle') ? (
                  <VehicleControls
                    vehicleId={item.id}
                    stats={item.stats}
                    cardType={cardType}
                  />
                ) : item.itemTypes.includes('drone') ? (
                  <DroneControls
                    droneId={item.id}
                    stats={item.stats}
                    cardType={cardType}
                  />
                ) : (
                  item.itemTypes.includes('reusable') && (
                    <ItemControls
                      itemId={item.id}
                      stats={item.stats}
                      cardType={cardType}
                    />
                  )
                ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ItemCardBorderless;
