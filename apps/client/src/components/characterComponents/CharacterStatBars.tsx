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
import { mdiCircleOutline, mdiMinus, mdiPlus } from '@mdi/js';
import BlockIcon from '../icons/BlockIcon';
import WardIcon from '../icons/WardIcon';
import ArmorIcon from '../icons/ArmorIcon';
import SpeedIcon from '../icons/SpeedIcon';
import EvasionIcon from '../icons/EvasionIcon';
import IconBtnSmall from '../buttons/IconBtnSmall';
import HandIcon from '../icons/HandIcon';
import FootIcon from '../icons/FootIcon';
import SizeIcon from '../icons/SizeIcon';
import ReactionIcon from '../icons/ReactionIcon';
import ActionIcon from '../icons/ActionIcon';

const CharacterStatBars = ({
  stats,
  characterId,
  handleChange,
  size = 'small',
}: {
  stats: CharacterStats;
  characterId: number;
  handleChange?: (stat: string, value: number) => void;
  size: 'small' | 'large';
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
          size={size}
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
          handleChange={
            handleChange
              ? (value: number) => handleChange('maxHealth', value)
              : undefined
          }
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
          size={size}
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
          handleChange={
            handleChange
              ? (value: number) => handleChange('maxSanity', value)
              : undefined
          }
        >
          <SanityIcon
            className={`${size === 'small' ? 'size-7' : 'size-8'} text-secondary`}
          />
        </StatBar>
      )}
      {stats.maxCyber ? (
        <StatBar
          title="Cyber"
          current={stats.cyber ?? stats.maxCyber}
          total={stats.maxCyber}
          color={statColorMap['Cyber']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('maxCyber', value)
              : undefined
          }
        >
          <CyberIcon className="text-secondary size-8" />
        </StatBar>
      ) : null}
      {stats.maxEquip ? (
        <StatBar
          title="Equip"
          current={stats.weight ?? stats.maxEquip}
          total={stats.maxEquip}
          color={statColorMap['Equip']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('maxEquip', value)
              : undefined
          }
        >
          <EquipIcon className="text-secondary text-blue size-8" />
        </StatBar>
      ) : null}
      {stats.speed != undefined && (
        <StatBar
          title="Speed"
          current={stats.speed}
          color={statColorMap['SPD']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('speed', value)
              : undefined
          }
        >
          <SpeedIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.evasion != undefined && (
        <StatBar
          title="Evasion"
          current={stats.evasion}
          color={statColorMap['EV']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('evasion', value)
              : undefined
          }
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
          size={size}
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
          size={size}
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
          size={size}
        >
          <BlockIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.size !== undefined && (
        <StatBar
          title="Size"
          current={stats.size}
          color={statColorMap['SZE']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('size', value)
              : undefined
          }
        >
          <SizeIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.permanentInjuries !== undefined && (
        <>
          {size === 'large' && <h4>Insanities</h4>}
          <InjuryIcon className="text-secondary size-8" />
          <div className="col-span-2 flex items-center justify-end gap-4 place-self-end">
            <div className={`flex grow items-center gap-2 justify-self-end`}>
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
            {handleChange && (
              <>
                <IconBtnSmall
                  onClick={() => handleChange('permanentInjuries', -1)}
                >
                  <Icon path={mdiMinus} />
                </IconBtnSmall>
                <IconBtnSmall
                  onClick={() => handleChange('permanentInjuries', 1)}
                >
                  <Icon path={mdiPlus} />
                </IconBtnSmall>
              </>
            )}
          </div>
        </>
      )}
      {stats.permanentInsanities !== undefined && (
        <>
          {size === 'large' && <h4>Insanities</h4>}
          <InsanityIcon className="text-secondary size-8" />
          <div className="col-span-2 flex items-center justify-end gap-4 place-self-end">
            <div className={`flex grow items-center gap-2 justify-self-end`}>
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
            {handleChange && (
              <>
                <IconBtnSmall
                  onClick={() => handleChange('permanentInsanities', -1)}
                >
                  <Icon path={mdiMinus} />
                </IconBtnSmall>
                <IconBtnSmall
                  onClick={() => handleChange('permanentInsanities', 1)}
                >
                  <Icon path={mdiPlus} />
                </IconBtnSmall>
              </>
            )}
          </div>
        </>
      )}
      {stats.hands !== undefined && (
        <StatBar
          title="Hands"
          current={stats.hands}
          color={statColorMap['Hands']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('hands', value)
              : undefined
          }
        >
          <HandIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.feet !== undefined && (
        <StatBar
          title="Feet"
          current={stats.feet}
          color={statColorMap['Feet']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('feet', value)
              : undefined
          }
        >
          <FootIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.actions !== undefined && (
        <StatBar
          title="Actions"
          current={stats.actions}
          color={statColorMap['Actions']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('actions', value)
              : undefined
          }
        >
          <ActionIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
      {stats.reactions !== undefined && (
        <StatBar
          title="Reactions"
          current={stats.reactions}
          color={statColorMap['Reactions']}
          size={size}
          handleChange={
            handleChange
              ? (value: number) => handleChange('reactions', value)
              : undefined
          }
        >
          <ReactionIcon className="text-secondary text-blue size-8" />
        </StatBar>
      )}
    </>
  );
};

export default CharacterStatBars;
