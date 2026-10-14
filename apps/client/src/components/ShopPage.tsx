import { useContext } from 'react';
import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import { useNavigate, useParams } from 'react-router-dom';
import useCharacter from 'src/hooks/useCharacter';
import { CampaignContext } from 'src/contexts/CampaignContext';
import Page from './Page';
import Shop from './Shop';
import Loading from './Loading';

const ShopPage = () => {
  const { activeCharacters } = useContext(CampaignContext);
  const { characterId, shopId } = useParams();
  const navigate = useNavigate();

  const { filteredCharacter: shop, isLoading: shopLoading } = useCharacter(
    Number(shopId),
  );

  const { filteredCharacter: character, isLoading: characterLoading } =
    useCharacter(Number(characterId));

  const isLoading = shopLoading || characterLoading;

  return (
    <Page title={`${shop?.name}'s Shop`}>
      {isLoading ? (
        <Loading />
      ) : (
        <>
          <div className="flex w-full items-center justify-center gap-4 px-8">
            {characterId && <CharacterPictureRound character={shop} />}
            <h2 className="text-left">{`${shop?.name}'s Shop`}</h2>
          </div>
          <div className="flex items-center justify-between gap-8">
            <div className="flex items-center justify-start gap-4">
              {activeCharacters &&
                activeCharacters.map((character) => (
                  <button
                    onClick={() =>
                      navigate(`../../../${character.id}/shop/${shopId}`)
                    }
                  >
                    <CharacterPictureRound
                      className={`${characterId === character.id && 'ring-4 ring-green-500'} size-10`}
                      character={character}
                    />
                  </button>
                ))}
            </div>
            <p>{character?.profits.toLocaleString()} p</p>
          </div>
        </>
      )}

      <Shop itemList={shop?.inventory} />
    </Page>
  );
};

export default ShopPage;
