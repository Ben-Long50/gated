import { useContext } from 'react';
import EquipIcon from './icons/EquipIcon';
import StatBar from './StatBar';
import { ThemeContext } from '../contexts/ThemeContext';
import HealthIcon from './icons/HealthIcon';
import SanityIcon from './icons/SanityIcon';
import CyberIcon from './icons/CyberIcon';
import { CharacterStats } from 'src/types/character';
import useCharacterStatMutation from 'src/hooks/character stat hooks/useCharacterStatMutation/useCharacterStatMutation';

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
      {stats.currentHealth !== undefined && (
        <StatBar
          title="Health"
          current={stats.currentHealth}
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
      {stats.currentSanity !== undefined && (
        <StatBar
          title="Sanity"
          current={stats.currentSanity}
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
          current={stats.cyber}
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
          current={stats.weight}
          total={stats.maxEquip}
          color={statColorMap['Equip']}
          cardWidth={cardWidth}
        >
          <EquipIcon className="text-secondary size-8" />
        </StatBar>
      )}
    </>
  );
};

export default CharacterStatBars;
