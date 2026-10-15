import BtnRect from '../buttons/BtnRect';
import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';

const AffiliationModal = () => {
  const navigate = useNavigate();

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return (
    <>
      <BtnRect
        className="w-full"
        type="button"
        ariaLabel="Submit conditions"
        onClick={() => {
          if (backgroundPath) {
            navigate(backgroundPath, { replace: true });
          }
        }}
      >
        Close
      </BtnRect>
    </>
  );
};

export default AffiliationModal;
