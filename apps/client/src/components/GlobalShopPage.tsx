import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import { useNavigate, useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import Page from './Page';
import useItemTypeQueries from 'src/hooks/useItemQueries/useItemTypeQueries';
import { itemTypes } from '@gated/shared';
import Loading from './Loading';
import Shop from './Shop';
import BtnAuth from './buttons/BtnAuth';
import useParts from 'src/hooks/useParts';

const GlobalShopPage = () => {
  const { characterId } = useParams();
  const navigate = useNavigate();

  const { parts } = useParts();

  const { filteredCharacter: character } = useCharacter(Number(characterId));

  const { items, isLoading } = useItemTypeQueries(itemTypes);

  if (isLoading) {
    <Loading />;
  }

  console.log(character);

  return (
    <Page title="Global Shop">
      <div className="flex w-full items-center justify-center gap-4 px-8">
        {characterId && <CharacterPictureRound character={character} />}
        <h2 className="text-left">Global Shop</h2>
      </div>
      {!characterId && (
        <BtnAuth
          onClick={() =>
            navigate(parts.includes('modal') ? 'bulk' : 'modal/bulk')
          }
        >
          Bulk Item Select
        </BtnAuth>
      )}
      <Shop itemList={items} />
    </Page>
  );
};

export default GlobalShopPage;
