import Modal from './Modal';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading';
import useEncounterHistoryQuery from 'src/hooks/encounter hooks/useEncounterHistoryQuery/useEncounterHistoryQuery';
import Divider from '../Divider';
import PhaseHistoryCard from '../encounterComponents/PhaseHistoryCard';

const HistoryModal = () => {
  const { encounterId } = useParams();
  const navigate = useNavigate();

  const { data: history, isLoading: historyLoading } = useEncounterHistoryQuery(
    Number(encounterId),
  );

  if (historyLoading) {
    return <Loading />;
  }

  return (
    <Modal>
      <h1>Action History</h1>
      {!history || history.length === 0 ? (
        <h2 className="italic">No Encounter History Available</h2>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {history.map((entry) => {
            return <PhaseHistoryCard key={entry.id} phaseHistory={entry} />;
          })}
        </div>
      )}
      <Divider />
      <BtnRect
        className="w-full"
        ariaLabel="Close"
        type="button"
        onClick={() => {
          navigate('..');
        }}
      >
        Close
      </BtnRect>
    </Modal>
  );
};

export default HistoryModal;
