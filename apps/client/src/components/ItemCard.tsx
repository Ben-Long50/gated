import { CSSProperties, Fragment, useContext, useRef } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeContainer from './ThemeContainer';
import ItemRarity from './ItemRarity';
import CartButton from './CartButton';
import { KeywordReference } from 'src/types/keyword';
import { Item } from 'src/types/item';
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
import ItemRadialMenu from './radialMenus/itemRadialMenu/ItemRadialMenu';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import Icon from '@mdi/react';
import { mdiLinkBoxVariantOutline } from '@mdi/js';
import { useInView } from 'react-intersection-observer';
import KeywordTag from './KeywordTag';
import ConditionTag from './ConditionTag';
import useRadialMenuStore from 'src/stores/radialMenuStore';
import { CampaignContext } from 'src/contexts/CampaignContext';
import StatBarContainer from './StatBarContainer';
import ActionCard from './ActionCard';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import { LayoutContext } from 'src/contexts/LayoutContext';
import rarityColorMap from 'src/utils/rarityColorMap';

const ItemCard = ({
  item,
  className,
  style,
  menu = true,
  size = 'large',
  ownerId,
}: {
  item: Item;
  className?: string;
  style?: CSSProperties;
  menu?: boolean;
  size?: 'small' | 'large';
  ownerId?: number;
}) => {
  const { gameMaster } = useContext(CampaignContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const { user } = useContext(AuthContext);

  const { conditionId, traitId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerRef = useRef(null);

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

  const linkedWeapons =
    item.itemLinkReference?.items.filter((item: Item) =>
      item.itemTypes.includes('weapon'),
    ) || [];
  const linkedArmors =
    item.itemLinkReference?.items.filter((item: Item) =>
      item.itemTypes.includes('armor'),
    ) || [];
  const linkedVehicles =
    item.itemLinkReference?.items.filter((item: Item) =>
      item.itemTypes.includes('vehicle'),
    ) || [];
  const uniqueActions = item.itemLinkReference?.actions || [];

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
              if (menu) {
                handleMenu(e);
              } else {
                navigate(`${item.id}`);
              }
            }}
          >
            {menu && <ItemRadialMenu item={item} containerRef={containerRef} />}
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
                      <ArrowHeader2 title={item?.name} />
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
                        <Fragment key={condition.id}>
                          <ConditionTag
                            key={condition.id}
                            condition={condition}
                          />
                          {Number(conditionId) === condition.id && (
                            <Outlet context={{ condition, parts }} />
                          )}
                        </Fragment>
                      ))}
                    </div>
                  </div>
                  <div className="flex grow items-start justify-end gap-4">
                    <p>{item?.price ? item.price + 'p' : 'N/A'}</p>
                    {parts.includes('shop') && <CartButton itemId={item?.id} />}
                  </div>
                </div>
                <div
                  className={`timing flex items-center justify-between gap-x-8 gap-y-2`}
                >
                  {item.keywords.length > 0 && (
                    <div className={`flex flex-wrap items-center gap-1`}>
                      {item.keywords.map((keyword: KeywordReference) => {
                        return (
                          <Fragment key={keyword.id}>
                            <KeywordTag key={keyword.id} keyword={keyword} />
                            {Number(traitId) === keyword.id && (
                              <Outlet context={{ keyword, parts }} />
                            )}
                          </Fragment>
                        );
                      })}
                    </div>
                  )}
                  <ItemRarity
                    className="ml-auto"
                    rarity={item?.rarity}
                    grade={item?.grade}
                    size={size}
                  />
                </div>
                <StatBarContainer size={size}>
                  <StatBars size={size} stats={item?.stats} />
                </StatBarContainer>
                <div>
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
                    <div className="flex flex-col gap-4">
                      <Divider />
                      <ArrowHeader3 title="Unique Actions" />
                      {uniqueActions.map((action) => (
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
