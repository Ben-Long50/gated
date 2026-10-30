import { useNavigate, useParams } from 'react-router-dom';
import Sidebar from '../sidebars/Sidebar';
import CharacterCardSmall from '../characterComponents/CharacterCardSmall';
import { PhaseHistory } from '@gated/shared';
import Loading from '../Loading';
import HistoryCard from './HistoryCard';
import IconBtnMedium from '../buttons/IconBtnMedium';
import Icon from '@mdi/react';
import { mdiChevronDown, mdiQueueFirstInLastOut } from '@mdi/js';
import { useState } from 'react';
import Divider from '../Divider';
import CharacterIcon from '../icons/CharacterIcon';
import LinkSidebar from '../sidebars/LinkSidebar';

const EncounterSidebar = ({
  turnOrder,
  turnPosition,
  history,
  historyLoading,
}: {
  turnOrder: number[];
  turnPosition: number;
  history: PhaseHistory[];
  historyLoading: boolean;
}) => {
  const [characterListOpen, setCharacterListOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <Sidebar
      open={characterListOpen}
      setOpen={setCharacterListOpen}
      position="left"
    >
      <div className="flex items-center gap-4">
        <CharacterIcon className="text-secondary size-12 shrink-0" />
        <h2 className="font-zen whitespace-nowrap text-xl">Turn Order</h2>
      </div>
      <Divider className="my-0" />
      <div
        className={`${characterListOpen ? 'gap-2' : 'gap-0'} timing flex h-full flex-col`}
      >
        {turnOrder?.map((characterId: number, index: number) => (
          <CharacterCardSmall
            key={index}
            expanding={true}
            characterListOpen={characterListOpen}
            characterId={characterId}
            active={
              turnOrder.findIndex((id) => id === characterId) === turnPosition
            }
          />
        ))}
      </div>
      <div className={`mt-auto max-h-full w-12 p-2`}>
        {historyLoading ? (
          <Loading className="text-accent" size={1.15} />
        ) : (
          <div
            className={`scrollbar-secondary-2 flex h-full w-full flex-col overflow-y-auto overflow-x-hidden`}
          >
            {history.map((h) => (
              <HistoryCard phaseHistory={h} />
            ))}
          </div>
        )}
      </div>
      <Divider className="my-0" />
      <LinkSidebar
        title="Action History"
        icon={
          <Icon
            className="timing group-hover:text-accent z-10 size-12 shrink-0 p-2 text-inherit"
            path={mdiQueueFirstInLastOut}
          />
        }
        path="modal/history"
      />
    </Sidebar>
  );
};

export default EncounterSidebar;
