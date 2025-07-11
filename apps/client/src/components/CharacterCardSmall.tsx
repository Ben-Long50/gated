import useCharacter from 'src/hooks/useCharacter';
import CharacterPictureRound from './CharacterPictureRound';
import CharacterStatBars from './CharacterStatBars';
import Loading from './Loading';
import ArrowHeader4 from './ArrowHeader4';
import WardIcon from './icons/WardIcon';
import SpeedIcon from './icons/SpeedIcon';
import EvasionIcon from './icons/EvasionIcon';
import ArmorIcon from './icons/ArmorIcon';
import useMapStore from 'src/stores/mapStore';
import { motion } from 'motion/react';
import ConditionTag from './ConditionTag';
import { useLayoutEffect, useRef, useState } from 'react';

const CharacterCardSmall = ({ characterId }: { characterId: number }) => {
  const { filteredCharacter: character, isLoading } = useCharacter(characterId);
  const [detailHeight, setDetailHeight] = useState(1000);

  const detailRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (detailRef.current) {
      setDetailHeight(detailRef.current.offsetHeight);
    }
  }, [detailRef.current]);

  const id = useMapStore((state) => state.characterId);

  if (isLoading) return <Loading size={1.25} />;

  return (
    <div className="bg-primary flex max-w-96 grow flex-col gap-1 truncate rounded p-2 px-3 shadow-md shadow-black">
      <ArrowHeader4 title={`${character?.firstName} ${character?.lastName}`} />

      <div className="relative flex w-full items-center gap-4">
        <CharacterPictureRound character={character} />
        {character?.conditions && character?.conditions.length > 0 && (
          <div className="absolute left-0 top-0 z-10 size-3 rounded-full bg-red-600 shadow-md shadow-black"></div>
        )}
        <div className="grid w-full grid-cols-[auto_auto_1fr_auto] place-items-center gap-2 gap-y-0">
          <CharacterStatBars
            characterId={character?.id}
            size="small"
            stats={{
              currentHealth: character?.stats.currentHealth,
              maxHealth: character?.stats.maxHealth,
              currentSanity: character?.stats.currentSanity,
              maxSanity: character?.stats.maxSanity,
            }}
            cardWidth={300}
          />
        </div>
      </div>
      <div className={`timing overflow-hidden px-4`}>
        <motion.div
          ref={detailRef}
          className="flex w-full flex-col items-center justify-around gap-2"
          initial={{ marginTop: -detailHeight - 4 }}
          animate={{
            marginTop: id === characterId ? 0 : -detailHeight - 4,
          }}
          transition={{ duration: 0.2 }}
        >
          <div className="flex w-full justify-start gap-1">
            {character?.conditions.map((condition) => (
              <ConditionTag condition={condition} />
            ))}
          </div>
          <div className="flex w-full items-center justify-around gap-2">
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="flex items-center justify-center gap-2">
                <SpeedIcon className="text-secondary size-7" />
                <p className="text-secondary text-xl sm:pt-1">
                  {character?.stats.speed}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="flex items-center justify-center gap-2">
                <EvasionIcon className="text-secondary size-7" />
                <p className="text-secondary text-xl sm:pt-1">
                  {character?.stats.evasion}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center justify-between gap-2">
              <div className="flex items-center justify-center gap-2">
                <ArmorIcon className="text-secondary size-7" />
                <p className="text-secondary text-xl sm:pt-1">
                  {character?.stats.armor}
                </p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-2">
              <WardIcon className="text-secondary size-7" />
              <p className="text-secondary text-xl sm:pt-1">
                {character?.stats.ward}
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CharacterCardSmall;
