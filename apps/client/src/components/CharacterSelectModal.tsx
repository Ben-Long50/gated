import { useOutletContext, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useCharacters from 'src/hooks/useCharacters';
import Loading from './Loading';
import InputFieldBasic from './InputFieldBasic';
import { Character } from 'src/types/character';
import CharacterCardSmall from './CharacterCardSmall';

const CharacterSelectModal = () => {
  const { campaignId } = useParams();

  const { form } = useOutletContext();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const {
    characters,
    filterByQuery,
    isLoading: charactersLoading,
  } = useCharacters(
    campaign?.characters.map((character) => character.id) || [],
  );

  if (charactersLoading) return <Loading />;

  return (
    <Modal
      button={
        <BtnRect ariaLabel="Select characters">Confirm Selection</BtnRect>
      }
    >
      <h1>Select Gang Characters</h1>
      <InputFieldBasic
        className="w-full"
        label="Search Characters"
        type="string"
        onChange={(value) => filterByQuery(value)}
      />
      <form.Field name="characters">
        {(field) => {
          return (
            <div className="flex w-full flex-col items-center gap-8">
              {characters.map((character: Character) => (
                <div
                  className="flex w-full items-center gap-4 sm:gap-8"
                  key={character.id}
                >
                  <CharacterCardSmall
                    className="grow"
                    characterList={true}
                    characterId={character.id}
                    expanding={false}
                    active={false}
                  />
                  <input
                    className="size-6"
                    type="checkbox"
                    checked={field.state.value.some(
                      (c: Character) => character.id === c.id,
                    )}
                    onChange={() => {
                      field.handleChange((prev: Character[]) => {
                        if (
                          prev.some((c: Character) => character.id === c.id)
                        ) {
                          return prev.filter(
                            (c: Character) => character.id !== c.id,
                          );
                        } else {
                          return [...prev, character];
                        }
                      });
                    }}
                  />
                </div>
              ))}
            </div>
          );
        }}
      </form.Field>
    </Modal>
  );
};

export default CharacterSelectModal;
