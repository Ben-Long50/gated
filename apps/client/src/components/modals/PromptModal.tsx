import { useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import PromptForm from '../forms/PromptForm';
import Modal from './Modal';

const PromptModal = () => {
  const { form } = useOutletContext();

  return (
    <Modal>
      <div className="flex w-full flex-col items-center gap-8">
        <h1>Prompt Info</h1>
        <PromptForm form={form} />
      </div>
    </Modal>
  );
};

export default PromptModal;
