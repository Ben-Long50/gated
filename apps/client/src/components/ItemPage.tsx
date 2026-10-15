import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import ItemRarity from './ItemRarity';
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
import ConditionTag from './ConditionTag';
import ExpandingList from './ExpandingList';
import useItem from 'src/hooks/useItem';
import { LayoutContext } from 'src/contexts/LayoutContext';
import StatBarContainer from './StatBarContainer';
import ActionCard from './ActionCard';
import ItemCard from './ItemCard';
import Page from './Page';

const ItemPage = () => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);

  const size = mobile ? 'small' : 'large';

  const { conditionId, itemId } = useParams();

  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { item, isLoading } = useItem(Number(itemId));

  if (isLoading) return <Loading />;

  if (!item) return <h1>No item found</h1>;

  return (
    <Page title={item.name}>
      <div className="relative grid h-full w-full grid-rows-[auto_auto] gap-8 sm:grid-cols-2 sm:grid-rows-1">
        <ItemPicture key={item.id} item={item} />
        <div className="flex w-full flex-col gap-8">
          {item.conditions.length > 0 && (
            <div className="flex flex-wrap items-center justify-start gap-1">
              {item.conditions?.map((condition) => (
                <ConditionTag key={condition.id} condition={condition} />
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
          <ArrowHeader2 className="self-start" title="Description" />
          <p className="self-start">{item.description}</p>
        </div>
      </div>
      {item.keywords?.length > 0 && (
        <ExpandingList title="Traits" className={`grid grid-cols-2 gap-2`}>
          {item.keywords?.map((item: KeywordReference) => {
            return (
              <ItemCardSmall
                key={item.keyword?.id}
                heading={
                  <h4>
                    {item.value
                      ? item.keyword?.name.replace(/X/g, item.value.toString())
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
      <Divider />
      <StatBarContainer size={size}>
        <StatBars stats={item.stats} size={size} />
      </StatBarContainer>
      {item.linkedItems.length > 0 && (
        <>
          <Divider />
          <div className="flex w-full items-center justify-between">
            <ArrowHeader2 className="self-start" title={`Item Slots`} />
            <p>{`( ${item.stats.currentSlots} / ${item.stats.slots} )`}</p>
          </div>

          <div className="flex w-full flex-col gap-8">
            {item.linkedItems.map((item: Item, index: number) => (
              <ItemCard key={index} itemId={item.id} size={size} />
            ))}
          </div>
        </>
      )}
      {item.linkedActions.length > 0 && (
        <>
          <Divider />
          <ArrowHeader2 className="self-start" title="Unique Actions" />
          <div className="flex w-full flex-col gap-8">
            {item.linkedActions.map((action: Action, index: number) => {
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
            <BtnRect
              ariaLabel="Navigate to weapon upgrade form"
              type="button"
              onClick={() => navigate('upgrade')}
            >
              {'Upgrade ' + item.name}
            </BtnRect>
          )}
      </div>
    </Page>
  );
};

export default ItemPage;
