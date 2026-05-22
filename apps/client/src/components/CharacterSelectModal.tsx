import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import useCharacters from 'src/hooks/useCharacters';
import Loading from './Loading';
import InputField from './formFields/InputField';
import { Character } from 'src/types/character';
import Divider from './Divider';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardXSmall from './CharacterCardXSmall';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';

const CharacterSelectModal = () => {
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
      <h1>Select Session Characters</h1>
      <InputField
        label="Search Characters"
        value={query}
        onChange={(value) => setQuery(value)}
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
                  <InputFieldCheckbox
                    value={character.id}
                    checked={field.state.value.some(
                      (id: number) => character.id === id,
                    )}
                    onChange={(value) => {
                      field.handleChange((prev: number[]) => {
                        if (prev.some((id: number) => value === id)) {
                          return prev.filter((id: number) => value !== id);
                        } else {
                          return [...prev, value];
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
