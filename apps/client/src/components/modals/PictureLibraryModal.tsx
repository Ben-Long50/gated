import { useNavigate, useOutletContext } from 'react-router-dom';
import BtnRect from '../buttons/BtnRect';
import Modal from './Modal';
import useModalStore from 'src/stores/modalStore';
import { useContext, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import Divider from '../Divider';
import { PictureCard } from '../PictureCard';
import NavTabs from '../NavTabs';
import BtnAuth from '../buttons/BtnAuth';
import InventoryGrid from '../InventoryGrid';
import InputSelectField from '../formFields/InputSelectField';
import useStandardLibraryQuery from 'src/hooks/useStandardLibraryQuery/useStandardLibraryQuery';

const PictureLibraryModal = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const { data: standardLibrary } = useStandardLibraryQuery();

  const [libraryType, setLibraryType] = useState(
    user.generatedPictures.length > 0 ? 'personal' : 'standard',
  );

  const backgroundPath = useModalStore((state) => state.backgroundPath);
  const { type: initialType, form } = useOutletContext();

  const [type, setType] = useState(initialType);

  let pictures = [];

  switch (libraryType) {
    case 'personal':
      pictures = user.generatedPictures.filter(
        (picture) => picture.type === type,
      );
      break;
    case 'standard':
      pictures =
        standardLibrary?.filter((picture) => picture.type === type) ?? [];
      break;
    default:
      pictures = [];
      break;
  }

  return (
    <>
      <h1>Library</h1>
      <Divider />
      <InputSelectField
        label="Library Type"
        value={libraryType}
        options={['standard', 'personal']}
        onChange={(value) => setLibraryType(value)}
      />
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
      <InventoryGrid minWidth={175}>
        <form.Field name="generatedPictureId">
          {(field) => {
            return pictures.map(
              (picture: { id: number; publicId: string }, index: number) => (
                <PictureCard
                  key={index}
                  publicId={picture.publicId}
                  onClick={() => {
                    field.handleChange(picture.id);
                    if (backgroundPath) {
                      navigate(backgroundPath, { replace: true });
                    }
                  }}
                />
              ),
            );
          }}
        </form.Field>
      </InventoryGrid>
    </>
  );
};

export default PictureLibraryModal;
