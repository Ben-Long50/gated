import { useOutletContext } from 'react-router-dom';
import Keywords from '../Keywords';

const KeywordLinkModal = () => {
  const { form } = useOutletContext() || {};

  return (
    <>
      <Keywords form={form} />
    </>
  );
};

export default KeywordLinkModal;
