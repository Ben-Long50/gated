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
  mode,
  cardWidth,
}: {
  stats: any;
  mode?: string;
  cardWidth: number;
}) => {
  const { statColorMap } = useContext(ThemeContext);

  return (
    <>
      {stats.currentActions && (
        <StatBar
          title="Actions"
          current={stats.currentActions}
          color={statColorMap['AP']}
          cardWidth={cardWidth}
        >
          <ActionIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentReactions && (
        <StatBar
          title="Reactions"
          current={stats.currentReactions}
          color={statColorMap['RP']}
          cardWidth={cardWidth}
        >
          <ReactionIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentHealth && (
        <StatBar
          title="Health"
          current={stats.currentHealth}
          color={statColorMap['Health']}
          cardWidth={cardWidth}
        >
          <HealthIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentSanity && (
        <StatBar
          title="Sanity"
          current={stats.currentSanity}
          color={statColorMap['Sanity']}
          cardWidth={cardWidth}
        >
          <SanityIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentPower && (
        <StatBar
          title="PWR"
          current={stats.currentPower}
          color={statColorMap['PWR']}
          cardWidth={cardWidth}
        >
          <LightningIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentAmmoCount && (
        <StatBar
          title="MAG"
          current={stats.currentAmmoCount}
          color={statColorMap['MAG']}
          cardWidth={cardWidth}
        >
          <MagCapacityIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.wyrmShells && (
        <StatBar
          title="Wyrm"
          current={stats.wyrmShells}
          color={statColorMap['wyrmShells']}
          cardWidth={cardWidth}
        >
          <WyrmShellIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentHands && (
        <StatBar
          title="Hands"
          current={stats.currentHands}
          color={statColorMap['Health']}
          cardWidth={cardWidth}
        >
          <HandIcon className="text-secondary size-8" />
        </StatBar>
      )}
      {stats.currentFeet && (
        <StatBar
          title="Feet"
          current={stats.currentFeet}
          color={statColorMap['Health']}
          cardWidth={cardWidth}
        >
          <FootIcon className="text-secondary size-8" />
        </StatBar>
      )}
    </>
  );
};

export default ActionStatBars;
