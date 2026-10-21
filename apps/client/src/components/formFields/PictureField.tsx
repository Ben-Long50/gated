import { FormApi, useStore } from '@tanstack/react-form';
import ThemeContainer from '../ThemeContainer';
import { useContext } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import useGeneratePictureMutation from 'src/hooks/useGeneratePictureMutation/useGeneratePictureMutation';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import { useSearchParams } from 'react-router-dom';
import IconBtnSmall from '../buttons/IconBtnSmall';
import usePromptForm from 'src/hooks/form hooks/usePromptForm';
import BtnAuth from '../buttons/BtnAuth';
import { PictureCard } from '../PictureCard';
import CloudinaryPicture from '../CloudinaryPicture';
import { AuthContext } from 'src/contexts/AuthContext';
import useStandardLibraryQuery from 'src/hooks/useStandardLibraryQuery/useStandardLibraryQuery';
import useGenerateStandardPictureMutation from 'src/hooks/useGenerateStandardPictureMutation/useGenerateStandardPictureMutation';
import { useNavigateWithQuery } from 'src/hooks/useNavigateWithQuery';
import useParts from 'src/hooks/useParts';
import InputFieldRadio from './InputFieldRadio';
import { capitalCase } from 'change-case';
import TextAreaField from './TextAreaField';

const PictureField = ({
  form,
  type,
}: {
  form: FormApi;
  type: 'character' | 'item' | 'scene';
}) => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigateWithQuery();
  const { parts } = useParts();

  const { data: standardLibrary } = useStandardLibraryQuery();

  const [searchParams] = useSearchParams();
  const formType = searchParams.get('formType');

  const generatePicture =
    parts.includes('pictures') && formType === 'codex'
      ? useGenerateStandardPictureMutation(type)
      : useGeneratePictureMutation(type);

  const promptForm = usePromptForm(generatePicture);

  const generationId = useStore(
    form.store,
    (state) => state.values.generatedPictureId,
  );

  const pictureList = standardLibrary
    ? [...user.generatedPictures, ...standardLibrary]
    : user.generatedPictures;
  const picture = pictureList.find((picture) => picture.id === generationId);

  let placeholder = '';

  switch (type) {
    case 'character':
      placeholder =
        'e.g. a tall and muscular adult man; clean shaven with long black hair. He is dressed in torn up gangster clothing and weilds a two handed cyber sword which glows green. He is standing with the sword resting on their shoulder.';
      break;
    case 'item':
      placeholder =
        'e.g. a long, slender sword with glowing blue circuitry running along the length of the blade. The sword is modeled after a katana and is sitting on an ornate, decorative stand.';
      break;
    case 'scene':
      placeholder =
        'e.g. a mob of cybernetically enhanced gangsters running down the street while a large ghastly entity chases them from behind.';
      break;
  }

  return (
    <div className="flex flex-col gap-8">
      <ThemeContainer
        className={`${type !== 'scene' && 'max-w-[600px]'} mx-auto my-auto w-full`}
        chamfer="medium"
        borderColor={accentPrimary}
        overflowHidden={true}
      >
        <CloudinaryPicture
          className="bg-secondary w-full overflow-hidden bg-black"
          style={
            type === 'scene'
              ? { aspectRatio: '16/9' }
              : { aspectRatio: 'square' }
          }
          publicId={picture?.publicId}
        />
      </ThemeContainer>
      <promptForm.Subscribe selector={(state) => state.values.pictureCount}>
        {(pictureCount) => (
          <div className="grid grid-cols-4 gap-4">
            <form.Field name="generatedPictureId">
              {(field) => {
                const pictures =
                  generatePicture.data?.newPictures ?? Array.from({ length: pictureCount });

                return pictures.map((picture, index) => {
                  return picture ? (
                    <PictureCard
                      key={index}
                      label={
                        field.state.value === picture.id
                          ? 'Selected'
                          : undefined
                      }
                      publicId={picture.publicId}
                      onClick={() => field.handleChange(picture.id)}
                    />
                  ) : (
                    <PictureCard label="" color={accentPrimary} key={index} />
                  );
                });
              }}
            </form.Field>
          </div>
        )}
      </promptForm.Subscribe>
      <promptForm.Field name="pictureCount">
        {(field) => (
          <div className="flex items-center justify-between gap-4">
            <IconBtnSmall
              active={field.state.value > 1}
              onClick={() => field.handleChange((prev) => prev - 1)}
              tooltip="Decrease"
            >
              <Icon path={mdiMinus} />
            </IconBtnSmall>
            <p>Picture Count {field.state.value}</p>
            <IconBtnSmall
              active={field.state.value < 4}
              onClick={() => field.handleChange((prev) => prev + 1)}
              tooltip="Increase"
            >
              <Icon path={mdiPlus} />
            </IconBtnSmall>
          </div>
        )}
      </promptForm.Field>

      <promptForm.Field name="time">
        {(field) => (
          <div className="flex w-full flex-col gap-2 border-x-2 border-gray-400 border-opacity-50 px-4">
            {['daytime', 'nighttime', 'sunrise', 'sunset'].map((time) => (
              <InputFieldRadio
                label={capitalCase(time)}
                checked={field.state.value === time}
                value={time}
                onChange={(value) => field.handleChange(value)}
              />
            ))}
          </div>
        )}
      </promptForm.Field>
      <promptForm.Field name="setting">
        {(field) => (
          <TextAreaField
            label="Setting Description"
            value={field.state.value}
            placeholder="e.g. a dimly lit city street with glowing neon lights in the background"
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </promptForm.Field>
      <promptForm.Field name="description">
        {(field) => (
          <TextAreaField
            label={`${capitalCase(type)} Description`}
            value={field.state.value}
            placeholder={placeholder}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </promptForm.Field>
      <div className="flex w-full flex-col gap-4">
        <BtnRect
          className="group"
          ariaLabel="Generate picture"
          active={!generatePicture.isPending}
          onClick={() => {
            if (!generatePicture.isPending) {
              promptForm.handleSubmit();
            }
          }}
        >
          {generatePicture.isPending ? (
            <Loading
              className="group-hover:text-accent text-zinc-950"
              size={1.15}
            />
          ) : (
            'Generate'
          )}
        </BtnRect>
        <BtnAuth
          className="group"
          onClick={() =>
            navigate(parts.includes('modal') ? 'library' : 'modal/library')
          }
        >
          Picture Library
        </BtnAuth>
      </div>
    </div>
  );
};

export default PictureField;
