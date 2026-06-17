import { FormApi, useStore } from '@tanstack/react-form';
import { Item } from 'src/types/item';
import ItemCard from '../ItemCard';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useItemQueries from 'src/hooks/useItemQueries/useItemQueries';
import BtnAuth from '../buttons/BtnAuth';
import Icon from '@mdi/react';
import { mdiLinkVariantOff } from '@mdi/js';
import IconBtnMedium from '../buttons/IconBtnMedium';
import Loading from '../Loading';

const ItemLinkField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const itemIds = useStore(form.store, (state) => state.values.itemIds);

  const { items, isLoading } = useItemQueries(itemIds);

  return (
    <>
      {parts.includes('links') && <Outlet context={{ form, parts }} />}
      {isLoading ? (
        <Loading />
      ) : (
        <form.Field name="itemIds">
          {(field) =>
            field.state.value.length > 0 && (
              <div className={`flex flex-col gap-4`}>
                {items?.map((item: Item, index) => {
                  return (
                    <div key={index} className="flex w-full items-center gap-4">
                      <ItemCard className="grow" item={item} />
                      <IconBtnMedium
                        onClick={() => {
                          field.handleChange(
                            field.state.value.filter(
                              (itemId: number) => Number(itemId) !== item?.id,
                            ),
                          );
                        }}
                      >
                        <Icon path={mdiLinkVariantOff} />
                      </IconBtnMedium>
                    </div>
                  );
                })}
              </div>
            )
          }
        </form.Field>
      )}
      <BtnAuth
        className="w-full min-w-48"
        onClick={() => {
          navigate('links?linkCategory=weapon&mode=form');
        }}
      >
        Link Items
      </BtnAuth>
    </>
  );
};

export default ItemLinkField;
