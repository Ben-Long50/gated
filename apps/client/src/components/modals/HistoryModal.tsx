import Modal from './Modal';
import BtnRect from '../buttons/BtnRect';
import { useNavigate, useParams } from 'react-router-dom';
import Loading from '../Loading';
import PhaseActionCard from '../maps/PhaseActionCard';
import useEncounterHistoryQuery from 'src/hooks/combat hooks/useEncounterHistoryQuery/useEncounterHistoryQuery';

const HistoryModal = () => {
  const { encounterId } = useParams();
  const navigate = useNavigate();

  const { data: history, isLoading: historyLoading } = useEncounterHistoryQuery(
    Number(encounterId),
  );

  if (historyLoading) {
    return <Loading />;
  }

  console.log(history);

  return (
    <Modal>
      <h1>Action History</h1>
      {history.map((entry) => {
        return <PhaseActionCard phaseAction={entry} />;
      })}
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
