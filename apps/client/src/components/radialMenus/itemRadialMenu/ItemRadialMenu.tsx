import { Item } from 'src/types/item';
import ConditionIcon from '../../icons/ConditionIcon';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useContext, useState } from 'react';
import WeaponIcon from '../../icons/WeaponIcon';
import Icon from '@mdi/react';
import { mdiCardTextOutline } from '@mdi/js';
import { AuthContext } from 'src/contexts/AuthContext';
import RadialMenu from '../RadialMenu';
import useRadialMenuStore from 'src/stores/radialMenuStore';

const ItemRadialMenu = ({
  item,
  containerRef,
}: {
  item: Item;
  containerRef: ReactNode;
}) => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const setMenuOpen = useRadialMenuStore((state) => state.setMenuOpen);

  const detailsPath = (() => {
    if (parts.includes('equipment') || parts.includes('deployments')) {
      return `../inventory/items/${item?.id}`;
    } else if (
      parts.includes('codex') ||
      parts.includes('inventory') ||
      parts.includes('shop')
    ) {
      return `${item?.id}`;
    } else return ``;
  })();

  return (
    <RadialMenu
      elementId={item.id}
      containerRef={containerRef}
      array={[
        {
          label: 'Conditions',
          element: (
            <div
              onClick={() => {
                if (item.userId === user?.id) {
                  navigate(`${item?.id}/conditions`);
                  setMenuOpen(false);
                }
              }}
            >
              {parts.includes('conditions') && <Outlet context={{ parts }} />}
              <ConditionIcon className="size-8 text-inherit" />
            </div>
          ),
        },
        {
          label: 'Nothing',
          element: (
            <div>
              <WeaponIcon className="size-8 text-inherit" />
            </div>
          ),
        },
        {
          label: 'Item Detials',
          element: (
            <div
              onClick={() => {
                navigate(detailsPath);
                setMenuOpen(false);
              }}
            >
              <Icon path={mdiCardTextOutline} className="size-8 text-inherit" />
            </div>
          ),
        },
      ]}
    />
  );
};

export default ItemRadialMenu;
