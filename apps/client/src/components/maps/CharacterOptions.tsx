import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import InputSelectField from '../InputSelectField';
import ArrowHeader3 from '../ArrowHeader3';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { useContext } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { Location, Map } from 'src/types/map';
import useMapStore from 'src/stores/mapStore';
import useActions from 'src/hooks/useActions';
import EquippedItems from './EquippedItems';
import DieIcon from '../icons/DieIcon';
import { AttributeTree } from 'src/types/attributeTree';
import BtnRect from '../buttons/BtnRect';
import { useNavigate } from 'react-router-dom';

const CharacterOptions = ({
  locations,
  characterId,
  setCharacter,
  calculateSuccesses,
}: {
  locations: Location[];
  characterId: number;
  setCharacter: (value: any) => void;
  calculateSuccesses: (
    attributes: AttributeTree,
    rolls: { attribute: string; skill: string }[],
    modifiers: string[],
  ) => void;
}) => {
  const { gameMaster } = useContext(CampaignContext);
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();
  const { filteredCharacter: character } = useCharacter(characterId);

  const action = useMapStore((state) => state.action);
  const setAction = useMapStore((state) => state.setAction);
  const { generalActions, filterBySubCategory } = useActions(
    character?.actions,
  );

  const availableActions =
    generalActions && character?.actions
      ? [...character.actions, ...generalActions]
      : [];

  return (
    <ThemeContainer
      className="!sticky bottom-[33px] mt-auto w-full max-w-5xl"
      borderColor={accentPrimary}
      chamfer="small"
    >
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex w-full items-center justify-start gap-4">
          {gameMaster ? (
            <div className="flex w-full items-center gap-4">
              {character && <CharacterPictureRound character={character} />}
              <InputSelectField
                label="Characters"
                options={locations.map((location) => location.character)}
                onChange={(value) => setCharacter(value)}
                reverse={true}
              />
            </div>
          ) : (
            <div className="flex w-full items-center gap-4">
              {character && <CharacterPictureRound character={character} />}
              <ArrowHeader3
                title={`${character?.firstName} ${character?.lastName}`}
              />
            </div>
          )}
          <InputSelectField
            label="Action Categories"
            options={['attack', 'movement', 'unique']}
            onChange={(category) => {
              filterBySubCategory(category);
            }}
            reverse={true}
          />
          <InputSelectField
            label="Actions"
            options={availableActions}
            onChange={(action) => {
              setAction(action);
            }}
            reverse={true}
          />
          <button
            className="bg-tertiary group my-auto flex justify-self-start rounded p-1.5 shadow-md shadow-black"
            aria-label="Roll selected action"
            type="button"
            onClick={() => {
              if (character && action) {
                calculateSuccesses(character.attributes, action.roll, []);
              }
            }}
          >
            <DieIcon
              className={`text-tertiary group-hover:text-accent timing size-8`}
            />
          </button>
        </div>
        {character && <EquippedItems characterId={character?.id} />}
        <BtnRect
          ariaLabel="Open initiative modal"
          type="button"
          onClick={() => navigate('initiative')}
        >
          Start Combat
        </BtnRect>
      </div>
    </ThemeContainer>
  );
};

export default CharacterOptions;
