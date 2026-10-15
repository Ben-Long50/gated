import { useOutletContext } from 'react-router-dom';
import Actions from '../Actions';

const ActionLinkModal = () => {
  const { form } = useOutletContext() || {};

  return (
    <>
      <Actions form={form} />
    </>
  );
};

export default ActionLinkModal;
