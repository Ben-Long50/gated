import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useCharacters from 'src/hooks/useCharacters';
import Loading from './Loading';
import InputField from './formFields/InputField';
import { Character } from 'src/types/character';
import { Fragment } from 'react/jsx-runtime';
import CharacterCardXSmall from './characterComponents/CharacterCardXSmall';
import InputFieldCheckbox from './formFields/InputFieldCheckbox';
import useModalStore from 'src/stores/modalStore';

const GangCharacterSelectModal = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const { form } = useOutletContext();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const backgroundPath = useModalStore((state) => state.backgroundPath);

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
          onClick={() => {
            if (backgroundPath) {
              navigate(backgroundPath, { replace: true });
            }
          }}
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
        <p>Character</p>
        <p className="justify-self-center">Leader</p>
        <p className="justify-self-center">Member</p>
        {characters
          .filter((character) => character != null)
          .map((character: Character) => (
            <Fragment key={character.id}>
              <CharacterCardXSmall
                characterList={true}
                character={character}
                active={false}
              />
              <form.Subscribe selector={(state) => state.values.characterIds}>
                {(characterIds) => {
                  const inCharacters = characterIds.includes(character.id);

                  return (
                    <form.Field name="leaderIds">
                      {(field) => {
                        const checked = field.state.value.some(
                          (id: number) => character.id === id,
                        );

                        return (
                          <InputFieldCheckbox
                            active={!inCharacters}
                            value={character.id}
                            checked={field.state.value.some(
                              (id: number) => character.id === id,
                            )}
                            onChange={(value) => {
                              field.handleChange((prev: number[]) =>
                                checked
                                  ? prev.filter(
                                      (id: number) => Number(value) !== id,
                                    )
                                  : [...prev, Number(value)],
                              );
                            }}
                          />
                        );
                      }}
                    </form.Field>
                  );
                }}
              </form.Subscribe>

              <form.Subscribe selector={(state) => state.values.leaderIds}>
                {(leaderIds) => {
                  const inLeaders = leaderIds.includes(character.id);

                  return (
                    <form.Field name="characterIds">
                      {(field) => {
                        const checked = field.state.value.some(
                          (id: number) => character.id === id,
                        );

                        return (
                          <InputFieldCheckbox
                            active={!inLeaders}
                            value={character.id}
                            checked={checked}
                            onChange={(value) => {
                              field.handleChange((prev: number[]) =>
                                checked
                                  ? prev.filter(
                                      (id: number) => Number(value) !== id,
                                    )
                                  : [...prev, Number(value)],
                              );
                            }}
                          />
                        );
                      }}
                    </form.Field>
                  );
                }}
              </form.Subscribe>
            </Fragment>
          ))}
      </div>
    </Modal>
  );
};

export default GangCharacterSelectModal;
