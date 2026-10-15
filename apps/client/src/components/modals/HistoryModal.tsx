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
    <>
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
    </>
  );
};

export default HistoryModal;
