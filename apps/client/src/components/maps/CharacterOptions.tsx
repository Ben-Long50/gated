import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from '../CharacterPictureRound';
import ArrowHeader3 from '../ArrowHeader3';
import { CampaignContext } from 'src/contexts/CampaignContext';
import { useContext } from 'react';
import ThemeContainer from '../ThemeContainer';
import { ThemeContext } from 'src/contexts/ThemeContext';
import EquippedItems from './EquippedItems';
import BtnRect from '../buttons/BtnRect';
import { useNavigate } from 'react-router-dom';
import useCombatStore from 'src/stores/combatStore';
import ActionIcon from '../icons/ActionIcon';
import ReactionIcon from '../icons/ReactionIcon';
import { FormApi } from '@tanstack/react-form';
import CharacterStatBars from '../CharacterStatBars';
import { LayoutContext } from 'src/contexts/LayoutContext';

const CharacterOptions = ({
  form,
  advanceTurn,
}: {
  form: FormApi;
  advanceTurn: () => void;
}) => {
  const { gameMaster } = useContext(CampaignContext);
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();

  const userCharacter = useCombatStore((state) => state.userCharacter);
  const activeCharacter = useCombatStore((state) => state.activeCharacter);

  const { filteredCharacter: character } = useCharacter(userCharacter);

  return (
    <ThemeContainer
      className="!sticky bottom-[33px] mt-auto w-full max-w-5xl"
      borderColor={accentPrimary}
      chamfer="small"
    >
      <div className="flex w-full flex-col gap-4 p-4">
        <div className="flex w-full items-center justify-start gap-4 sm:gap-8">
          {character && (
            <>
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
            </>
          )}
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
        {character && userCharacter === activeCharacter && (
          <EquippedItems form={form} characterId={character?.id} />
        )}
        {gameMaster && !activeCharacter && (
          <BtnRect
            ariaLabel="Open initiative modal"
            type="button"
            onClick={() => navigate('initiative')}
          >
            Start Combat
          </BtnRect>
        )}
        {activeCharacter && activeCharacter === userCharacter && (
          <BtnRect
            ariaLabel="Pass turn"
            type="button"
            onClick={() => {
              advanceTurn();
              form.reset();
            }}
          >
            Pass Turn
          </BtnRect>
        )}
      </div>
    </ThemeContainer>
  );
};

export default CharacterOptions;
