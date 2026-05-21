import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useCharacters from 'src/hooks/useCharacters';
import Loading from './Loading';
import InputField from './InputField';
import { Character } from 'src/types/character';
import { Fragment } from 'react/jsx-runtime';
import Divider from './Divider';
import CharacterCardXSmall from './CharacterCardXSmall';

const GangCharacterSelectModal = () => {
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();

  const { form } = useOutletContext();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const {
    characters,
    query,
    setQuery,
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
      <h1>Select Gang Characters</h1>
      <InputField
        label="Search Characters"
        value={query}
        onChange={(value) => setQuery(value)}
      />
      <div className="grid w-full grid-cols-[8fr_1fr_1fr] items-center gap-4">
        <h4>Character</h4>
        <h4 className="justify-self-center">Leader</h4>
        <h4 className="justify-self-center">Member</h4>
        <Divider className="col-span-3 opacity-50" />
        {characters
          .filter((character) => character != null)
          .map((character: Character) => (
            <Fragment key={character.id}>
              <CharacterCardXSmall
                menu={false}
                characterList={true}
                characterId={character.id}
                active={false}
              />
              <form.Field name="leaderIds">
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
            </Fragment>
          ))}
      </div>
    </Modal>
  );
};

export default GangCharacterSelectModal;
