import { useContext } from 'react';
import MagCapacityIcon from './icons/MagCapacityIcon';
import StatBar from './StatBar';
import { ThemeContext } from '../contexts/ThemeContext';
import HealthIcon from './icons/HealthIcon';
import SanityIcon from './icons/SanityIcon';
import LightningIcon from './icons/LightningIcon';
import ActionIcon from './icons/ActionIcon';
import ReactionIcon from './icons/ReactionIcon';
import WyrmShellIcon from './icons/WyrmShellIcon';
import HandIcon from './icons/HandIcon';
import FootIcon from './icons/FootIcon';

const ActionStatBars = ({
  stats,
  size = 'small',
}: {
  stats: any;
  size: 'small' | 'large';
}) => {
  const { statColorMap } = useContext(ThemeContext);

  return (
    <>
      {stats.currentActions && (
        <StatBar
          title="Actions"
          current={stats.currentActions}
          color={statColorMap['AP']}
          size={size}
        >
          <ActionIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentReactions && (
        <StatBar
          title="Reactions"
          current={stats.currentReactions}
          color={statColorMap['RP']}
          size={size}
        >
          <ReactionIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentHealth && (
        <StatBar
          title="Health"
          current={stats.currentHealth}
          color={statColorMap['Health']}
          size={size}
        >
          <HealthIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentSanity && (
        <StatBar
          title="Sanity"
          current={stats.currentSanity}
          color={statColorMap['Sanity']}
          size={size}
        >
          <SanityIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentPower && (
        <StatBar
          title="PWR"
          current={stats.currentPower}
          color={statColorMap['PWR']}
          size={size}
        >
          <LightningIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentAmmoCount && (
        <StatBar
          title="MAG"
          current={stats.currentAmmoCount}
          color={statColorMap['MAG']}
          size={size}
        >
          <MagCapacityIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.wyrmShells && (
        <StatBar
          title="Wyrm"
          current={stats.wyrmShells}
          color={statColorMap['wyrmShells']}
          size={size}
        >
          <WyrmShellIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentHands && (
        <StatBar
          title="Hands"
          current={stats.currentHands}
          color={statColorMap['Health']}
          size={size}
        >
          <HandIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentFeet && (
        <StatBar
          title="Feet"
          current={stats.currentFeet}
          color={statColorMap['Health']}
          size={size}
        >
          <FootIcon className="text-secondary size-8" />
        </StatBar>
      )}
    </>
  );
};

export default ActionStatBars;
