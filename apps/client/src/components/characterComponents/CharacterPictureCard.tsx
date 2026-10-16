import { PictureCard } from '../PictureCard';
import CharacterCardMenu from './CharacterCardMenu';
import { useContext, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import StatBarContainer from '../StatBarContainer';
import CharacterStatBars from './CharacterStatBars';
import useCharacter from 'src/hooks/useCharacter';

const CharacterPictureCard = ({
  characterId,
  onClick,
}: {
  characterId: number;
  onClick: (characterId: number) => void;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const [details, setDetails] = useState(false);

  const { filteredCharacter: character, isLoading } = useCharacter(characterId);

  return (
    <div
      className="relative"
      onMouseEnter={() => setDetails(true)}
      onMouseLeave={() => setDetails(false)}
    >
      <PictureCard
        className="w-full border-opacity-50 hover:border-opacity-100"
        loading={isLoading}
        label={
          <div
            className={`${details && 'bg-slate-900/50'} flex w-full flex-col`}
          >
            <div className="flex items-end justify-between gap-4">
              <p className="text-left">{character?.name}</p>
              <p className="!text-accent font-zen text-right">
                {character?.level ?? 'NPC'}
              </p>
            </div>
            <div
              className={`${details ? 'max-h-[300px] pb-2 pt-4' : 'max-h-0'} timing overflow-hidden`}
            >
              <StatBarContainer size="small">
                <CharacterStatBars
                  size="small"
                  stats={{
                    currentHealth: character?.stats.currentHealth,
                    maxHealth: character?.stats.maxHealth,
                    currentSanity: character?.stats.currentSanity,
                    maxSanity: character?.stats.maxSanity,
                    speed: character?.stats.speed,
                    armor: character?.stats.armor,
                    equippedArmor: character?.stats.equippedArmor,
                    ward: character?.stats.ward,
                    equippedWard: character?.stats.equippedWard,
                    injuries: character?.stats.injuries,
                    permanentInjuries: character?.stats.permanentInjuries,
                    insanities: character?.stats.insanities,
                    permanentInsanities: character?.stats.permanentInsanities,
                  }}
                />
              </StatBarContainer>
            </div>
          </div>
        }
        publicId={character?.generatedPicture?.publicId}
        color={accentPrimary}
        onClick={() => onClick(character.id)}
      />

      <CharacterCardMenu character={character} />
    </div>
  );
};

export default CharacterPictureCard;
