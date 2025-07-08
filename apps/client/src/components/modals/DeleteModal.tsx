import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import BtnAuth from '../buttons/BtnAuth';
import Modal from './Modal';
import { mdiAlertCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';
import useDeleteMapMutation from 'src/hooks/useDeleteMapMutation/useDeleteMapMutation';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Loading from '../Loading';

const DeleteModal = () => {
  const { apiUrl } = useContext(AuthContext);
  const navigate = useNavigate();
  const { campaignId, mapId } = useParams();

  const [formMessage, setFormMessage] = useState('');

  const { name } = useOutletContext() || {};

  const deleteMap = useDeleteMapMutation(
    apiUrl,
    Number(campaignId),
    Number(mapId),
    setFormMessage,
  );

  return (
    <Modal>
      <div className="flex w-full flex-col gap-8">
        <div className="flex items-center justify-center gap-4">
          <Icon
            className="text-error"
            path={mdiAlertCircleOutline}
            size={2.5}
          />
          <h2 className="text-error">Warning</h2>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="text-center">
            You are about to delete the map "{name}"
          </h3>
          <h3 className="text-error text-center">
            Press "Confirm Delete" to permanently delete the map
          </h3>
        </div>
        <div className="grid w-full grid-cols-2 gap-8">
          <BtnAuth onClick={() => navigate(-1)}>Cancel</BtnAuth>
          <BtnAuth className="group" onClick={() => deleteMap.mutate()}>
            {deleteMap.isPaused ? (
              <Loading
                className="group-hover:text-accent text-secondary"
                size={1.15}
              />
            ) : (
              'Confirm Delete'
            )}
          </BtnAuth>
        </div>
        {deleteMap.isError && (
          <p>
            Error: <span className="text-error">{formMessage}</span>
          </p>
        )}
      </div>
    </Modal>
  );
};

export default DeleteModal;
