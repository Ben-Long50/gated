import { useContext, useState } from 'react';
import InputField from './formFields/InputField';
import { FormApi } from '@tanstack/react-form';
import Loading from './Loading';
import useBaseItems from '../hooks/useBaseItems';
import { Item, ItemType } from 'src/types/item';
import { LayoutContext } from '../contexts/LayoutContext';
import Icon from '@mdi/react';
import { mdiCropSquare, mdiGrid, mdiLinkVariant, mdiSync } from '@mdi/js';
import { useOutletContext, useSearchParams } from 'react-router-dom';
import InputSelectField from './formFields/InputSelectField';
import { capitalCase } from 'change-case';
import ItemCard from './ItemCard';
import BtnAuth from './buttons/BtnAuth';
import IconBtnMedium from './buttons/IconBtnMedium';

const Items = ({
  itemTypes,
  itemList,
  form,
}: {
  itemTypes?: ItemType[];
  itemList?: Item[];
  form?: FormApi;
}) => {
  const { mobile } = useContext(LayoutContext);
  const [searchParams, setSearchParams] = useSearchParams();

  const { categorizedShopItems } = useOutletContext() || {};

  const category = searchParams.get('category') || '';
  const linkCategory = searchParams.get('linkCategory') || '';
  const mode = searchParams.get('mode');
  const include = searchParams.getAll('include');
  const exclude = searchParams.getAll('exclude');

  const [size, setSize] = useState<'small' | 'large'>(() =>
    mobile ? 'small' : 'large',
  );

  const cardSize = mobile || size === 'small' ? 'small' : 'large';

  const itemCategory = mode && mode === 'form' ? linkCategory : category;

  const {
    items,
    keywords,
    query,
    trait,
    priceFilter,
    rarity,
    setQuery,
    setTrait,
    setPriceFilter,
    setRarity,
    isLoading,
  } = useBaseItems({
    categories: itemTypes || [itemCategory],
    itemList: categorizedShopItems || itemList || undefined,
    includedKeywords: include.length > 0 ? include : undefined,
    excludedKeywords: exclude.length > 0 ? exclude : undefined,
  });

  return (
    <div
      className={`${mobile ? 'gap-4' : 'gap-8'} flex w-full flex-col items-start`}
    >
      <h2 className="font-zen text-4xl">
        {itemCategory ? `${capitalCase(itemCategory)}s` : ''}
      </h2>
      {mode && mode === 'form' && (
        <div
          className={`${mobile ? 'flex-col' : 'flex-row'} flex w-full gap-4`}
        >
          <BtnAuth
            active={linkCategory === 'weapon'}
            className="w-full grow"
            onClick={() =>
              setSearchParams({ linkCategory: 'weapon', mode: 'form' })
            }
          >
            Weapons
          </BtnAuth>
          <BtnAuth
            active={linkCategory === 'armor'}
            className="w-full grow"
            onClick={() =>
              setSearchParams({ linkCategory: 'armor', mode: 'form' })
            }
          >
            Armors
          </BtnAuth>
          <BtnAuth
            active={linkCategory === 'vehicle'}
            className="w-full grow"
            onClick={() =>
              setSearchParams({ linkCategory: 'vehicle', mode: 'form' })
            }
          >
            Vehicles
          </BtnAuth>
        </div>
      )}
      <div className="flex w-full flex-col gap-4">
        <div
          className={`${mobile ? 'grid-cols-1' : 'grid-cols-3'} grid w-full items-center justify-between gap-4`}
        >
          <InputSelectField
            label="Trait"
            options={keywords || []}
            value={trait}
            onChange={(value) => {
              setTrait(value);
            }}
          />
          <InputSelectField
            label="Price"
            options={['lowToHigh', 'highToLow']}
            value={priceFilter}
            onChange={(value) => {
              setPriceFilter(value);
            }}
          />
          <InputSelectField
            label={`Rarity`}
            options={['common', 'uncommon', 'rare', 'blackMarket', 'artifact']}
            value={rarity}
            onChange={(value) => {
              setRarity(value);
            }}
          />
        </div>
        <div className="flex items-center gap-4">
          <InputField
            label={
              itemCategory
                ? `Search ${capitalCase(itemCategory)}`
                : 'Search All'
            }
            value={query}
            onChange={(value) => {
              setQuery(value);
            }}
          />
          {!mobile && (
            <IconBtnMedium
              onClick={() => setSize(size === 'large' ? 'small' : 'large')}
            >
              <Icon path={size === 'large' ? mdiGrid : mdiCropSquare} />
            </IconBtnMedium>
          )}
          <IconBtnMedium
            onClick={() => {
              setQuery('');
              setTrait('');
              setPriceFilter('');
              setRarity('');
            }}
          >
            <Icon path={mdiSync} />
          </IconBtnMedium>
        </div>
      </div>
      {form ? (
        <form.Field name="itemIds">
          {(field) => (
            <div
              className={`${cardSize === 'small' ? 'grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-4' : 'grid-cols-1 gap-8'} grid w-full`}
            >
              {isLoading ? (
                <Loading />
              ) : (
                items?.map((item: Item) => {
                  const linkCount = field.state.value.reduce(
                    (sum: number, id: number) => {
                      if (id === item.id) {
                        return sum + 1;
                      } else {
                        return sum;
                      }
                    },
                    0,
                  );

                  return (
                    <div
                      key={item.id}
                      className="flex w-full items-center gap-4"
                    >
                      <ItemCard itemId={item.id} size={cardSize} menu={false} />
                      <div className="flex flex-col items-center justify-center gap-2">
                        {linkCount > 0 && <p>{linkCount}</p>}
                        <IconBtnMedium
                          onClick={() => {
                            field.handleChange((prev) => [...prev, item.id]);
                          }}
                        >
                          <Icon path={mdiLinkVariant} />
                        </IconBtnMedium>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </form.Field>
      ) : (
        <div
          className={`${mobile ? 'gap-4' : 'gap-8'} ${cardSize === 'small' ? 'grid-cols-[repeat(auto-fit,minmax(350px,1fr))]' : 'grid-cols-1'} grid w-full`}
        >
          {isLoading ? (
            <Loading />
          ) : (
            items?.map((item: Item) => (
              <ItemCard itemId={item.id} size={cardSize} menu={false} />
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default Items;
