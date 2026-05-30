import { useContext } from 'react';
import EquipIcon from '../icons/EquipIcon';
import StatBar from '../StatBar';
import { ThemeContext } from '../../contexts/ThemeContext';
import HealthIcon from '../icons/HealthIcon';
import SanityIcon from '../icons/SanityIcon';
import CyberIcon from '../icons/CyberIcon';
import { CharacterStats } from 'src/types/character';
import useCharacterStatMutation from 'src/hooks/character stat hooks/useCharacterStatMutation/useCharacterStatMutation';
import InjuryIcon from '../icons/InjuryIcon';
import InsanityIcon from '../icons/InsanityIcon';
import Icon from '@mdi/react';
import { mdiCircleOutline } from '@mdi/js';
import BlockIcon from '../icons/BlockIcon';
import WardIcon from '../icons/WardIcon';
import ArmorIcon from '../icons/ArmorIcon';
import SpeedIcon from '../icons/SpeedIcon';
import EvasionIcon from '../icons/EvasionIcon';

const CharacterStatBars = ({
  stats,
  cardWidth,
  characterId,
  size,
}: {
  stats: CharacterStats;
  cardWidth: number;
  characterId: number;
  size: 'large' | 'small';
}) => {
  const { statColorMap } = useContext(ThemeContext);

  const editCharacterStat = useCharacterStatMutation();

  return (
    <>
      {stats.maxHealth !== undefined && (
        <StatBar
          title="Health"
          current={stats.currentHealth ?? stats.maxHealth}
          total={stats.maxHealth}
          color={statColorMap['Health']}
          cardWidth={cardWidth}
          mutation={(value: number) => {
            if (
              (value > 0 && stats.currentHealth < stats.maxHealth) ||
              (value < 0 && stats.currentHealth > 0)
            ) {
              editCharacterStat.mutate({
                characterId,
                stats: { currentHealth: value },
              });
            }
          }}
          mode="adjustable"
          size={size}
        >
          <HealthIcon
            className={`${size === 'small' ? 'size-7' : 'size-8'} text-secondary`}
          />
        </StatBar>
      )}
      {stats.maxSanity !== undefined && (
        <StatBar
          title="Sanity"
          current={stats.currentSanity ?? stats.maxSanity}
          total={stats.maxSanity}
          color={statColorMap['Sanity']}
          cardWidth={cardWidth}
          mutation={(value: number) => {
            if (
              (value > 0 && stats.currentSanity < stats.maxSanity) ||
              (value < 0 && stats.currentSanity > 0)
            ) {
              editCharacterStat.mutate({
                characterId,
                stats: { currentSanity: value },
              });
            }
          }}
          mode="adjustable"
          size={size}
        >
          <SanityIcon
            className={`${size === 'small' ? 'size-7' : 'size-8'} text-secondary`}
          />
        </StatBar>
      )}
      {stats.maxCyber !== undefined && (
        <StatBar
          title="Cyber"
          current={stats.cyber ?? stats.maxCyber}
          total={stats.maxCyber}
          color={statColorMap['Cyber']}
          cardWidth={cardWidth}
        >
          <CyberIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.maxEquip !== undefined && (
        <StatBar
          title="Equip"
          current={stats.weight ?? stats.maxEquip}
          total={stats.maxEquip}
          color={statColorMap['Equip']}
          cardWidth={cardWidth}
        >
          <EquipIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.speed != undefined && (
        <StatBar
          title="Speed"
          current={stats.speed}
          color={statColorMap['SPD']}
          cardWidth={cardWidth}
        >
          <SpeedIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.evasion != undefined && (
        <StatBar
          title="Evasion"
          current={stats.evasion}
          color={statColorMap['EV']}
          cardWidth={cardWidth}
        >
          <EvasionIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.equippedArmor > 0 && (
        <StatBar
          title="Armor"
          current={stats.armor}
          total={stats.equippedArmor}
          color={statColorMap['AV']}
          cardWidth={cardWidth}
        >
          <ArmorIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.equippedWard > 0 && (
        <StatBar
          title="Ward"
          current={stats.ward}
          total={stats.equippedWard}
          color={statColorMap['WV']}
          cardWidth={cardWidth}
        >
          <WardIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.blockPoints > 0 && (
        <StatBar
          title="Block Points"
          current={stats.currentBlockPoints}
          total={stats.blockPoints}
          color={statColorMap['BP']}
          cardWidth={cardWidth}
        >
          <BlockIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}

      {stats.permanentInjuries !== undefined && (
        <>
          <h4>Insanities</h4>
          <InjuryIcon className="text-secondary size-8" />
          <div
            className={`col-span-2 flex grow items-center gap-2 justify-self-end`}
          >
            {Array.from({
              length: stats.permanentInjuries,
            }).map((_, index) =>
              index < stats.injuries ? (
                <InjuryIcon
                  key={index}
                  className="text-secondary size-7 shrink-0 sm:size-8"
                />
              ) : (
                <Icon
                  path={mdiCircleOutline}
                  key={index}
                  className="text-tertiary size-7 shrink-0 p-1 sm:size-8"
                />
              ),
            )}
          </div>
        </>
      )}
      {stats.permanentInsanities !== undefined && (
        <>
          <h4>Insanities</h4>
          <InsanityIcon className="text-secondary size-8" />
          <div
            className={`col-span-2 flex grow items-center gap-2 justify-self-end`}
          >
            {Array.from({
              length: stats.permanentInsanities,
            }).map((_, index) =>
              index < stats.insanities ? (
                <InsanityIcon
                  key={index}
                  className="text-secondary size-7 shrink-0 sm:size-8"
                />
              ) : (
                <Icon
                  path={mdiCircleOutline}
                  key={index}
                  className="text-tertiary size-7 shrink-0 p-1 sm:size-8"
                />
              ),
            )}
          </div>
        </>
      )}
    </>
  );
};

export default CharacterStatBars;
