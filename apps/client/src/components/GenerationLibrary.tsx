import { useNavigate } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import NavTabs from './NavTabs';
import BtnAuth from './buttons/BtnAuth';
import { PictureCard } from './PictureCard';
import useDeleteUnusedPicturesMutation from 'src/hooks/useDeleteUnusedPicturesMutation/useDeleteUnusedPicturesMutation';
import Loading from './Loading';
import InventoryGrid from './InventoryGrid';
import userLimits from 'src/utils/constants/userLimits';
import ArrowHeader2 from './ArrowHeader2';
import Page from './Page';

const GenerationLibrary = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [type, setType] = useState('character');
  const pictureStorageLimit = userLimits[user.role].pictures;

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  const deleteUnusedPictures = useDeleteUnusedPicturesMutation();

  const pictures = user.generatedPictures.filter(
    (picture) => picture.type === type,
  );

  return (
    <Page title="Generated Pictures">
      <div className="flex w-full items-center justify-between gap-8">
        <ArrowHeader2 title={`Picture Storage`} />
        <p>{`( ${user.generatedPictures.length} / ${pictureStorageLimit} )`}</p>
      </div>
      <NavTabs className="grid-cols-3">
        <BtnAuth
          active={type === 'character'}
          onClick={() => setType('character')}
        >
          Characters
        </BtnAuth>
        <BtnAuth active={type === 'item'} onClick={() => setType('item')}>
          Items
        </BtnAuth>
        <BtnAuth active={type === 'scene'} onClick={() => setType('scene')}>
          Scenes
        </BtnAuth>
      </NavTabs>

      <BtnAuth
        onClick={() => {
          if (!deleteUnusedPictures.isPending) {
            deleteUnusedPictures.mutate({ type, count: 100 });
          }
        }}
      >
        {deleteUnusedPictures.isPending ? (
          <Loading size={1.15} />
        ) : (
          'Delete Oldest Unused Pictures'
        )}
      </BtnAuth>

      <InventoryGrid minWidth={175}>
        {pictures.map(
          (picture: { id: number; publicId: string }, index: number) => (
            <PictureCard
              key={index}
              publicId={picture.publicId}
              onClick={() => {
                form.setFieldValue('generatedPictureId', picture.id);
                if (backgroundPath) {
                  navigate(backgroundPath, { replace: true });
                }
              }}
            />
          ),
        )}
      </InventoryGrid>
    </Page>
  );
};

export default GenerationLibrary;
