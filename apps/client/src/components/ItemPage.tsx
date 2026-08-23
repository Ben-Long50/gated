import { Fragment, useContext, useLayoutEffect, useRef, useState } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { ThemeContext } from '../contexts/ThemeContext';
import ThemeContainer from './ThemeContainer';
import {
  Link,
  Outlet,
  useLocation,
  useNavigate,
  useParams,
} from 'react-router-dom';
import ItemRarity from './ItemRarity';
import CartButton from './CartButton';
import Icon from '@mdi/react';
import {
  mdiCalendarCheckOutline,
  mdiCalendarRemoveOutline,
  mdiLinkBoxVariantOutline,
} from '@mdi/js';
import { Action } from 'src/types/action';
import BtnRect from './buttons/BtnRect';
import ItemPicture from './ItemPicture';
import Divider from './Divider';
import Loading from './Loading';
import StatBars from './StatBars';
import ArrowHeader2 from './ArrowHeader2';
import ItemCardSmall from './ItemCardSmall';
import { KeywordReference } from 'src/types/keyword';
import { Item } from 'src/types/item';
import LinkedItemCard from './LinkedItemCard';
import LinkedActionCard from './LinkedActionCard';
import ItemRadialMenu from './radialMenus/itemRadialMenu/ItemRadialMenu';
import ConditionTag from './ConditionTag';
import ExpandingList from './ExpandingList';
import useItem from 'src/hooks/useItem';
import { LayoutContext } from 'src/contexts/LayoutContext';
import StatBarContainer from './StatBarContainer';
import ActionCard from './ActionCard';

const ItemPage = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);

  const size = mobile ? 'small' : 'large';

  const { conditionId, itemId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { item, isLoading } = useItem(Number(itemId));

  const linkedWeapons =
    item?.linkedItems.filter((item) => item.itemTypes.includes('weapon')) || [];

  const linkedArmor =
    item?.linkedItems.filter((item) => item.itemTypes.includes('armor')) || [];

  const linkedVehicles =
    item?.linkedItems.filter((item) => item.itemTypes.includes('vehicle')) ||
    [];

  const linkedModifiactions =
    item?.linkedItems.filter((item) =>
      item.itemTypes.includes('modification'),
    ) || [];

  const linkedActions = item?.linkedActions || [];

  if (isLoading) return <Loading />;

  if (!item) return <h1>No item found</h1>;

  return (
    <div className="flex w-full flex-col items-center gap-8">
      <h1 className="col-start-2 text-center">{item.name}</h1>
      <div className="relative grid h-full w-full grid-rows-[auto_auto] gap-8 sm:grid-cols-2 sm:grid-rows-1">
        <ItemPicture key={item.id} item={item} />
        <div className="flex w-full flex-col gap-4">
          {item.conditions.length > 0 && (
            <div className="flex flex-wrap items-center justify-start gap-1">
              {item.conditions?.map((condition) => (
                <Fragment key={condition.id}>
                  <ConditionTag key={condition.id} condition={condition} />
                  {Number(conditionId) === condition.id && (
                    <Outlet context={{ condition, parts }} />
                  )}
                </Fragment>
              ))}
            </div>
          )}
          <div className="flex items-center justify-between">
            <ItemRarity
              className="col-span-2 place-self-start"
              rarity={item?.rarity}
              grade={item?.grade}
              size={size}
            />
            <h4>Cost {item.price ? <span>{`${item.price}p`}</span> : 'N/A'}</h4>
          </div>
          {item.keywords?.length > 0 && (
            <ExpandingList
              title="Traits"
              className={`col-start-1 row-start-2 flex flex-wrap items-center gap-2`}
            >
              {item.keywords?.map((item: KeywordReference) => {
                return (
                  <ItemCardSmall
                    key={item.keyword?.id}
                    heading={
                      <h4>
                        {item.value
                          ? item.keyword?.name.replace(
                              /X/g,
                              item.value.toString(),
                            )
                          : item.keyword?.name}
                      </h4>
                    }
                  >
                    <p>
                      {item.value
                        ? item.keyword?.description.replace(
                            /X/g,
                            item.value.toString(),
                          )
                        : item.keyword?.description}
                    </p>
                  </ItemCardSmall>
                );
              })}
            </ExpandingList>
          )}
        </div>
      </div>
      {item && (
        <StatBarContainer size={size}>
          <StatBars stats={item.stats} size={size} />
        </StatBarContainer>
      )}
      <p className="self-start">{item.description}</p>
      {linkedWeapons.length > 0 && (
        <>
          <Divider />
          <ArrowHeader2 className="self-start" title="Integrated Weapons" />
          <div className="flex w-full flex-col gap-8">
            {linkedWeapons.map((weapon: Item, index: number) => {
              return <LinkedItemCard key={index} item={weapon} size={size} />;
            })}
          </div>
        </>
      )}
      {linkedArmor.length > 0 && (
        <>
          <Divider />
          <ArrowHeader2 className="self-start" title="Integrated Armor" />
          <div className="flex w-full flex-col gap-8">
            {linkedArmor.map((armor: Item, index: number) => {
              return <LinkedItemCard key={index} item={armor} size={size} />;
            })}
          </div>
        </>
      )}
      {linkedVehicles.length > 0 && (
        <>
          <Divider />
          <ArrowHeader2 className="self-start" title="Supplied Vehicles" />
          <div className="flex w-full flex-col gap-8">
            {linkedVehicles.map((vehicle: Item, index: number) => {
              return <LinkedItemCard key={index} item={vehicle} size={size} />;
            })}
          </div>
        </>
      )}
      {linkedActions.length > 0 && (
        <>
          <Divider />
          <ArrowHeader2 className="self-start" title="Unique Actions" />
          <div className="flex w-full flex-col gap-8">
            {linkedActions.map((action: Action, index: number) => {
              return (
                <ActionCard
                  expanded={true}
                  key={index}
                  actionId={action.id}
                  size={size}
                />
              );
            })}
          </div>
        </>
      )}
      {linkedModifiactions.length > 0 && (
        <ThemeContainer chamfer="small" borderColor={accentPrimary}>
          <p className="text-accent absolute -top-3 left-5 z-20 text-base">
            Modifications
          </p>
          <div className="flex flex-col gap-4 p-4">
            {linkedModifiactions.map((modification: Item, index: number) => {
              return (
                <Fragment key={modification.id}>
                  <LinkedItemCard
                    key={modification.id}
                    item={modification}
                    size={size}
                  />
                  {index < linkedModifiactions.length - 1 && <Divider />}
                </Fragment>
              );
            })}
          </div>
        </ThemeContainer>
      )}
      <Divider />
      <div className="flex w-full flex-col gap-4">
        {((parts.includes('codex') && user?.role === 'ADMIN') ||
          (parts.includes('codex') && user?.role === 'SUPERADMIN')) && (
          <BtnRect
            ariaLabel="Navigat to edit weapon form"
            className="w-full"
            type="button"
            onClick={() => navigate('update')}
          >
            {'Edit ' + item.name}
          </BtnRect>
        )}
        {item.characterIventory &&
          item.characterInventory.character.userId === user.id && (
            <Link className="w-full" to="upgrade">
              <BtnRect ariaLabel="Navigate to modify weapon form" type="button">
                {'Upgrade ' + item.name}
              </BtnRect>
            </Link>
          )}
      </div>
    </div>
  );
};

export default ItemPage;
