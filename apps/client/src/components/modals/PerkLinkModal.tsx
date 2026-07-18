import Modal from './Modal';
import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import useModalStore from 'src/stores/modalStore';
import Perks from '../Perks';
import ArrowHeader4 from '../ArrowHeader4';
import PerkCard from '../PerkCard';

const PerkLinkModal = () => {
  const { form, level, attributeTree } = useOutletContext() || {};
  const navigate = useNavigate();

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  return (
    <Modal
      button={
        <>
          <form.Subscribe selector={(state) => state.values.perkIds}>
            {(perkIds: number[]) => (
              <div className="flex w-full flex-col items-start gap-4">
                <ArrowHeader4 className="text-primary" title="Selected Perks" />
                <div className="grid w-full grid-cols-2 gap-4">
                  {perkIds.map((perkId: number) => (
                    <PerkCard perkId={perkId} form={form} />
                  ))}
                </div>
              </div>
            )}
          </form.Subscribe>
          <BtnRect
            type="button"
            ariaLabel="Close"
            className="w-full"
            onClick={() => {
              if (backgroundPath) {
                navigate(backgroundPath, { replace: true });
              }
            }}
          >
            Close
          </BtnRect>
        </>
      }
    >
      <Perks form={form} level={level} attributeTree={attributeTree} />
    </Modal>
  );
};

export default PerkLinkModal;
