import { useNavigate, useSearchParams } from 'react-router-dom';
import useModalStore from 'src/stores/modalStore';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import NavTabs from './NavTabs';
import BtnAuth from './buttons/BtnAuth';
import { PictureCard } from './PictureCard';
import useDeleteUnusedPicturesMutation from 'src/hooks/useDeleteUnusedPicturesMutation/useDeleteUnusedPicturesMutation';

const GenerationLibrary = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [searchParams, setSearchParams] = useSearchParams();
  const type = searchParams.get('type');

  const backgroundPath = useModalStore((state) => state.backgroundPath);

  const deleteUnusedPictures = useDeleteUnusedPicturesMutation();

  const pictures = user.generatedPictures.filter(
    (picture) => picture.type === type,
  );

  return (
    <>
      <NavTabs className="grid-cols-3">
        <BtnAuth
          active={type === 'character'}
          onClick={() => setSearchParams({ type: 'character' })}
        >
          Characters
        </BtnAuth>
        <BtnAuth
          active={type === 'item'}
          onClick={() => setSearchParams({ type: 'item' })}
        >
          Items
        </BtnAuth>
        <BtnAuth
          active={type === 'scene'}
          onClick={() => setSearchParams({ type: 'scene' })}
        >
          Scenes
        </BtnAuth>
      </NavTabs>
      <BtnAuth onClick={() => deleteUnusedPictures.mutate()}>
        Delete Unused Pictures
      </BtnAuth>
      <div className="grid w-full grid-cols-5 gap-4 sm:gap-6">
        {pictures.map(
          (picture: { imageUrl: string; publicId: string }, index: number) => (
            <PictureCard
              key={index}
              publicId={picture.publicId}
              onClick={() => {
                const currentPicture = form.getFieldValue('picture');
                form.setFieldValue('picture', {
                  ...currentPicture,
                  imageUrl: picture.imageUrl,
                  publicId: picture.publicId,
                });
                if (backgroundPath) {
                  navigate(backgroundPath, { replace: true });
                }
              }}
            />
          ),
        )}
      </div>
    </>
  );
};

export default GenerationLibrary;
