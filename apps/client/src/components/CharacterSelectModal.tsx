import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import useCharacters from 'src/hooks/useCharacters';
import Loading from './Loading';
import InputFieldBasic from './InputFieldBasic';
import { Character } from 'src/types/character';
import CharacterCardSmall from './CharacterCardSmall';
import Divider from './Divider';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardXSmall from './CharacterCardXSmall';

const CharacterSelectModal = () => {
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();

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
        <BtnRect
          ariaLabel="Select characters"
          onClick={gangId ? () => form.handleSubmit() : () => navigate('..')}
        >
          Confirm Selection
        </BtnRect>
      }
    >
      <h1>Select Session Characters</h1>
      <InputFieldBasic
        className="w-full"
        label="Search Characters"
        type="string"
        onChange={(value) => filterByQuery(value)}
      />
      <Divider className="col-span-3 opacity-50" />
      <div className="flex w-full flex-col gap-4">
        {characters
          .filter((character) => character != null)
          .map((character: Character) => (
            <div
              className="flex w-full items-center justify-between gap-8"
              key={character.id}
            >
              <CharacterCardXSmall
                characterList={true}
                characterId={character.id}
                active={false}
              />
              <form.Field name="characterIds">
                {(field) => (
                  <input
                    className="size-6 justify-self-center"
                    type="checkbox"
                    checked={field.state.value.some(
                      (id: number) => character.id === id,
                    )}
                    onChange={() => {
                      field.handleChange((prev: number[]) => {
                        if (prev.some((id: number) => character.id === id)) {
                          return prev.filter(
                            (id: number) => character.id !== id,
                          );
                        } else {
                          return [...prev, character.id];
                        }
                      });
                    }}
                  />
                )}
              </form.Field>
            </div>
          ))}
      </div>
    </Modal>
  );
};

export default CharacterSelectModal;
