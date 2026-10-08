import BtnRect from '../buttons/BtnRect';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';

const AffiliationModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return (
    <>
      {parts.includes('affiliations') && <Outlet context={{ parts }} />}
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
