import { useOutletContext, useParams } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Modal from './modals/Modal';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useCharacters from 'src/hooks/useCharacters';
import Loading from './Loading';
import InputFieldBasic from './InputFieldBasic';
import { Character } from 'src/types/character';
import CharacterCardSmall from './CharacterCardSmall';
import { Fragment } from 'react/jsx-runtime';
import Divider from './Divider';

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

      <div className="grid w-full grid-cols-[8fr_1fr_1fr] items-center gap-x-4 sm:gap-x-8">
        <h4>Character</h4>
        <h4 className="justify-self-center">Leader</h4>
        <h4 className="justify-self-center">Member</h4>
        <Divider className="col-span-3 opacity-50" />
        {characters.map((character: Character) => (
          <Fragment key={character.id}>
            <CharacterCardSmall
              className="mb-4 grow sm:mb-8"
              characterList={true}
              characterId={character.id}
              expanding={false}
              active={false}
            />
            <form.Field name="leaders">
              {(field) => (
                <input
                  className="size-6 justify-self-center"
                  type="checkbox"
                  checked={field.state.value.some(
                    (c: Character) => character.id === c.id,
                  )}
                  onChange={() => {
                    field.handleChange((prev: Character[]) => {
                      if (prev.some((c: Character) => character.id === c.id)) {
                        return prev.filter(
                          (c: Character) => character.id !== c.id,
                        );
                      } else {
                        return [...prev, character];
                      }
                    });
                  }}
                />
              )}
            </form.Field>
            <form.Field name="characters">
              {(field) => (
                <input
                  className="size-6 justify-self-center"
                  type="checkbox"
                  checked={field.state.value.some(
                    (c: Character) => character.id === c.id,
                  )}
                  onChange={() => {
                    field.handleChange((prev: Character[]) => {
                      if (prev.some((c: Character) => character.id === c.id)) {
                        return prev.filter(
                          (c: Character) => character.id !== c.id,
                        );
                      } else {
                        return [...prev, character];
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

export default CharacterSelectModal;
