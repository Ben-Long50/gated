import { FormApi, useStore } from '@tanstack/react-form';
import { Item } from 'src/types/item';
import ItemCard from '../ItemCard';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useItemQueries from 'src/hooks/useItemQueries/useItemQueries';
import Loading from '../Loading';
import BtnAuth from '../buttons/BtnAuth';
import Icon from '@mdi/react';
import { mdiLinkVariantOff } from '@mdi/js';
import IconBtnMedium from '../buttons/IconBtnMedium';
import ArrowHeader3 from '../ArrowHeader3';

const ItemLinkField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const itemIds = useStore(form.store, (state) => state.values.itemIds);

  const { items, isLoading } = useItemQueries(itemIds);

  return (
    <>
      {items.length > 0 && <ArrowHeader3 title={'Linked Items'} />}
      <form.Field name="itemIds">
        {(field) => (
          <>
            {parts.includes('links') && <Outlet context={{ field, parts }} />}
            {isLoading ? (
              <Loading />
            ) : (
              items?.map((item: Item, index) => {
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
              })
            )}
          </>
        )}
      </form.Field>
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
