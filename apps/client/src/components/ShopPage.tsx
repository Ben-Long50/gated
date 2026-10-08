import BtnAuth from './buttons/BtnAuth';
import { useContext, useState } from 'react';
import Icon from '@mdi/react';
import { mdiCartOutline } from '@mdi/js';
import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Divider from './Divider';
import { ThemeContext } from 'src/contexts/ThemeContext';
import useParts from 'src/hooks/useParts';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Inventory from './Inventory';
import Page from './Page';

const ShopPage = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { activeCharacters } = useContext(CampaignContext);
  const { characterId, itemId } = useParams();
  const [shopCharacterId, setShopCharacterId] = useState<number | null>(() =>
    activeCharacters ? activeCharacters[0].id : Number(characterId),
  );
  const navigate = useNavigate();
  const { parts } = useParts();

  const { filteredCharacter: shop } = useCharacter(Number(characterId));
  const { filteredCharacter: character } = useCharacter(
    Number(shopCharacterId),
  );

  const cartLength = Object.values(character?.characterCart || {})
    .filter(Array.isArray)
    .flat()
    .reduce((sum, item) => sum + item.quantity, 0);

  const inventory = characterId ? shop?.inventory : undefined;

  return (
    <Page context={{ shopCharacterId }}>
      <div className="flex w-full items-center justify-center gap-4 px-8">
        {characterId && <CharacterPictureRound character={shop} />}
        <h2 className="text-left">
          {characterId ? `${shop?.name}'s Shop` : 'Global Shop'}
        </h2>
      </div>
      <div className="flex items-center justify-between gap-8">
        <div className="flex items-center justify-start gap-4">
          <button
            className="group relative"
            onClick={() =>
              navigate(parts.includes('modal') ? 'cart' : 'modal/cart', {
                state: { shopCharacterId },
              })
            }
          >
            <Icon
              className="group-hover:text-accent text-secondary timing size-12 shrink-0 p-2"
              path={mdiCartOutline}
            />
            <p
              className="shadow-color absolute right-0 top-0 flex h-6 min-w-6 items-center justify-center rounded-full pt-0.5 text-center text-base font-semibold shadow-md dark:text-gray-950"
              style={{ backgroundColor: accentPrimary }}
            >
              {cartLength}
            </p>
          </button>
          {activeCharacters &&
            activeCharacters.map((character) => (
              <button onClick={() => setShopCharacterId(character.id)}>
                <CharacterPictureRound
                  className={`${shopCharacterId === character.id && 'ring-4 ring-green-500'} size-10`}
                  character={character}
                />
              </button>
            ))}
        </div>
        <p>{character?.profits.toLocaleString()} p</p>
      </div>
      {!characterId && (
        <BtnAuth
          onClick={() =>
            navigate(parts.includes('modal') ? 'bulk' : 'modal/bulk', {
              state: { shopCharacterId },
            })
          }
        >
          Bulk Item Select
        </BtnAuth>
      )}
      <Divider className="my-0" />
      <Inventory itemList={inventory} shopCharacterId={shopCharacterId} />
      {/* {(parts.includes('cart') || parts.includes('bulk') || itemId) && (
        <Outlet context={{ shopCharacterId }} />
      )} */}
    </Page>
  );
};

export default ShopPage;
