import Items from '../Items';
import { useOutletContext } from 'react-router-dom';

const ItemLinkModal = () => {
  const { form } = useOutletContext() || {};

  return (
    <>
      <Items form={form} />
    </>
  );
};

export default ItemLinkModal;
