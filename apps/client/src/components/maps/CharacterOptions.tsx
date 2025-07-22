import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import { useContext, useState } from 'react';
import EquippedItems from './EquippedItems';
import BtnRect from '../buttons/BtnRect';
import ActionIcon from '../icons/ActionIcon';
import ReactionIcon from '../icons/ReactionIcon';
import { FormApi } from '@tanstack/react-form';
import CharacterStatBars from '../CharacterStatBars';
import { LayoutContext } from 'src/contexts/LayoutContext';
import Icon from '@mdi/react';
import { mdiChevronDown } from '@mdi/js';

const CharacterOptions = ({
  form,
  setActionSidebar,
  encounterPermissions,
  handleAdvanceTurn,
  characterId,
}: {
  form: FormApi;
  setActionSidebar: (state: boolean) => void;
  encounterPermissions: boolean;
  handleAdvanceTurn: () => void;
  characterId: number;
}) => {
  const { mobile } = useContext(LayoutContext);
  const [equipmentList, setEquipmentList] = useState(true);

  const { filteredCharacter: character } = useCharacter(characterId);

  return (
    <>
      <div className="flex w-full items-center justify-start gap-4 sm:gap-8">
        <div className="flex items-center gap-4">
          <CharacterPictureRound character={character} />
          {!mobile && (
            <ArrowHeader3
              title={`${character?.firstName} ${character?.lastName}`}
            />
          )}
        </div>
        <div className="grid w-full grow grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-0">
          <CharacterStatBars
            size="large"
            characterId={character?.id}
            stats={{
              currentHealth: character?.stats.currentHealth,
              maxHealth: character?.stats.maxHealth,
              currentSanity: character?.stats.currentSanity,
              maxSanity: character?.stats.maxSanity,
            }}
            cardWidth={300}
          />
        </div>

        <div className="flex flex-col gap-2">
          <div className={`${mobile ? 'gap-2' : 'gap-4'} flex items-center`}>
            <ActionIcon
              className={`${mobile ? 'size-7' : 'size-8'} text-primary shrink-0`}
            />
            <h2 className={`${mobile ? 'size-6' : 'size-8'} text-center`}>
              {character?.stats.currentActions}
            </h2>
          </div>
          <div className={`${mobile ? 'gap-2' : 'gap-4'} flex items-center`}>
            <ReactionIcon
              className={`${mobile ? 'size-7' : 'size-8'} text-primary shrink-0`}
            />
            <h2 className={`${mobile ? 'size-6' : 'size-8'} text-center`}>
              {character?.stats.currentReactions}
            </h2>
          </div>
        </div>
      </div>
      <button
        className="bg-tertiary group absolute left-0 top-1/2 z-20 -translate-x-1/2 -translate-y-1/2 rounded-full p-1 shadow shadow-black"
        onClick={() => setEquipmentList((prev) => !prev)}
      >
        <Icon
          path={mdiChevronDown}
          className={`${equipmentList ? 'rotate-0' : 'rotate-180'} timing text-tertiary group-hover:text-accent size-7`}
        />
      </button>
      <div
        className={`${equipmentList ? 'visible max-h-40 opacity-100' : 'invisible max-h-0 opacity-0'} timing h-full`}
      >
        <EquippedItems
          form={form}
          setActionSidebar={setActionSidebar}
          encounterPermissions={encounterPermissions}
          characterId={character?.id}
        />
      </div>
      {encounterPermissions && (
        <BtnRect
          ariaLabel="Pass turn"
          type="button"
          onClick={() => {
            handleAdvanceTurn();
            form.reset();
          }}
        >
          Pass Turn
        </BtnRect>
      )}
    </>
  );
};

export default CharacterOptions;
