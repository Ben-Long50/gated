import Modal from '../modals/Modal';
import Loading from '../Loading';
import CharacterCardXSmall from './CharacterCardXSmall';
import useCodexCharactersQuery from 'src/hooks/useCodexCharactersQuery/useCodexCharactersQuery';
import IconBtnSmall from '../buttons/IconBtnSmall';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import useCharacters from 'src/hooks/useCharacters';
import { useParams, useSearchParams } from 'react-router-dom';
import FormLayout from 'src/layouts/FormLayout';
import useCharacterAddForm from 'src/hooks/form hooks/useCharacterAddForm';
import useAddCharacterMutation from 'src/hooks/useCharacterAddMutation/useCharacterAddMutation';

const CharacterAddModal = () => {
  const { campaignId, gangId } = useParams();
  const { data: codexCharacters, isLoading } = useCodexCharactersQuery();

  const [searchParams, setSearchParams] = useSearchParams();

  const addCharacters = useAddCharacterMutation(Number(campaignId));
  const characterAddForm = useCharacterAddForm(
    addCharacters,
    Number(campaignId),
    Number(gangId),
  );

  const characterIds = codexCharacters?.map((character) => character.id) ?? [];

  const { characters, params } = useCharacters(characterIds);

  if (isLoading) return <Loading />;

  return (
    <Modal>
      <h1>Add Characters</h1>
      <FormLayout
        label="Characters"
        form={characterAddForm}
        createMutation={addCharacters}
      >
        <NavTabs>
          <BtnAuth
            active={params === 'nonPlayerCharacter '}
            onClick={() =>
              setSearchParams({ characterType: 'nonPlayerCharacter' })
            }
          >
            NPCs
          </BtnAuth>
          <BtnAuth
            active={params === 'nonPlayerCharacter goon'}
            onClick={() =>
              setSearchParams({
                characterType: 'nonPlayerCharacter',
                npcType: 'goon',
              })
            }
          >
            Goons
          </BtnAuth>
          <BtnAuth
            active={params === 'nonPlayerCharacter monster'}
            onClick={() =>
              setSearchParams({
                characterType: 'nonPlayerCharacter',
                npcType: 'monster',
              })
            }
          >
            Monsters
          </BtnAuth>
        </NavTabs>
        <div className="flex w-full flex-col gap-4">
          <characterAddForm.Field name="characterList">
            {(field) =>
              characters?.map((character) => {
                const quantity =
                  field.state.value.find(
                    (data) => data.characterId === character.id,
                  )?.quantity ?? 0;

                return (
                  <div
                    className="flex w-full items-center justify-between gap-8"
                    key={character.id}
                  >
                    <CharacterCardXSmall
                      characterList={true}
                      characterId={character.id}
                      active={false}
                    />
                    <div className="flex items-center gap-4">
                      <IconBtnSmall
                        active={quantity > 0}
                        tooltip="Decrease"
                        onClick={() =>
                          field.handleChange((prev) =>
                            quantity > 1
                              ? prev.map((data) =>
                                  data.characterId === character.id
                                    ? { ...data, quantity: data.quantity - 1 }
                                    : data,
                                )
                              : prev.filter(
                                  (data) => data.characterId !== character.id,
                                ),
                          )
                        }
                      >
                        <Icon path={mdiMinus} />
                      </IconBtnSmall>
                      <p className="w-20 text-center">Qty. {quantity}</p>
                      <IconBtnSmall
                        tooltip="Increase"
                        onClick={() =>
                          field.handleChange((prev) =>
                            quantity > 0
                              ? prev.map((data) =>
                                  data.characterId === character.id
                                    ? { ...data, quantity: data.quantity + 1 }
                                    : data,
                                )
                              : [
                                  ...prev,
                                  { characterId: character.id, quantity: 1 },
                                ],
                          )
                        }
                      >
                        <Icon path={mdiPlus} />
                      </IconBtnSmall>
                    </div>
                  </div>
                );
              })
            }
          </characterAddForm.Field>
        </div>
      </FormLayout>
    </Modal>
  );
};

export default CharacterAddModal;
