import { FormApi, useStore } from '@tanstack/react-form';
import ArrowHeader2 from '../ArrowHeader2';
import { Item } from 'src/types/item';
import ItemCard from '../ItemCard';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import useItemQueries from 'src/hooks/useItemQueries/useItemQueries';
import Loading from '../Loading';
import BtnAuth from '../buttons/BtnAuth';
import Icon from '@mdi/react';
import { mdiLinkVariantOff } from '@mdi/js';

const ItemLinkField = ({ form }: { form: FormApi }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const itemIds = useStore(form.store, (state) => state.values.itemIds);

  const { items, isLoading } = useItemQueries(itemIds);

  return (
    <>
      {items.length > 0 && <ArrowHeader2 title={'Linked Items'} />}
      <form.Field name="itemIds">
        {(field) => (
          <>
            {parts.includes('links') && <Outlet context={{ field }} />}
            {isLoading ? (
              <Loading />
            ) : (
              items?.map((item: Item, index) => {
                return (
                  <div key={index} className="flex w-full items-center gap-4">
                    <ItemCard className="grow" item={item} />
                    <button
                      className="shadow-color hover:border-accent timing bg-secondary group rounded border-2 border-transparent p-4"
                      onClick={() => {
                        field.handleChange(
                          field.state.value.filter(
                            (itemId: number) => itemId !== item?.id,
                          ),
                        );
                      }}
                    >
                      <Icon
                        className="text-primary timing group-hover:text-accent"
                        path={mdiLinkVariantOff}
                        size={1.2}
                      />
                    </button>
                  </div>
                );
              })
            )}
          </>
        )}
      </form.Field>
      <BtnAuth
        className="w-full min-w-48"
        ariaLabel="Open link item modal"
        type="button"
        onClick={(e) => {
          e.preventDefault();
          navigate('links?linkCategory=weapon&mode=form');
        }}
      >
        Link Items
      </BtnAuth>
    </>
  );
};

export default ItemLinkField;
