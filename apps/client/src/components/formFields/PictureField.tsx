import { FormApi } from '@tanstack/react-form';
import ThemeContainer from '../ThemeContainer';
import { useContext, useEffect } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import useGeneratePictureMutation from 'src/hooks/useGeneratePictureMutation/useGeneratePictureMutation';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import IconBtnSmall from '../buttons/IconBtnSmall';
import usePromptForm from 'src/hooks/form hooks/usePromptForm';
import BtnAuth from '../buttons/BtnAuth';
import { PictureCard } from '../PictureCard';
import TrueFalseIndicator from '../TrueFalseIndicator';
import CloudinaryPicture from '../CloudinaryPicture';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { AuthContext } from 'src/contexts/AuthContext';

const PictureField = ({
  form,
  type,
}: {
  form: FormApi;
  type: 'character' | 'item' | 'scene';
}) => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { mobile } = useContext(LayoutContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/');

  const generatePicture = useGeneratePictureMutation(type);

  const promptForm = usePromptForm(generatePicture);

  useEffect(() => {
    if (generatePicture.data) {
      form.setFieldValue(
        'generatedPictureId',
        generatePicture.data?.newPictures[0].id,
      );
    }
  }, [generatePicture.data]);

  return (
    <div
      className={`${mobile ? 'flex flex-col gap-4' : 'grid grid-cols-2 gap-6'} h-full`}
    >
      <div className="flex flex-col gap-8">
        <ThemeContainer
          className="mx-auto my-auto w-full max-w-3xl"
          chamfer="medium"
          borderColor={accentPrimary}
          overflowHidden={true}
        >
          <form.Subscribe selector={(state) => state.values.generatedPictureId}>
            {(generatedPictureId: number) => {
              const picture = generatedPictureId
                ? user.generatedPictures.find(
                    (p) => p.id === generatedPictureId,
                  )
                : null;

              return (
                <CloudinaryPicture
                  className="bg-secondary h-full overflow-hidden bg-black"
                  publicId={picture?.publicId}
                />
              );
            }}
          </form.Subscribe>
        </ThemeContainer>
      </div>
      <div className="flex flex-col gap-8">
        <promptForm.Field name="pictureCount">
          {(field) => (
            <div className="flex items-center justify-between gap-4">
              <IconBtnSmall
                active={field.state.value > 1}
                onClick={() => field.handleChange((prev) => prev - 1)}
              >
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <p>Picture Count {field.state.value}</p>
              <IconBtnSmall
                active={field.state.value < 4}
                onClick={() => field.handleChange((prev) => prev + 1)}
              >
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </div>
          )}
        </promptForm.Field>
        <promptForm.Subscribe selector={(state) => state.values.pictureCount}>
          {(pictureCount) => (
            <div className="grid grid-cols-4 gap-4">
              <form.Field name="generatedPictureId">
                {(field) =>
                  Array.from({ length: pictureCount }).map((_, index) => {
                    const picture = generatePicture.data?.newPictures[index];

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
                  })
                }
              </form.Field>
            </div>
          )}
        </promptForm.Subscribe>
        <div className="mt-auto flex flex-col gap-3 border-x-2 border-x-gray-400 border-opacity-50 px-4">
          <promptForm.Subscribe
            selector={(state) => [
              state.values.time,
              state.values.setting,
              state.values.description,
            ]}
          >
            {([time, setting, description]) => (
              <>
                <TrueFalseIndicator label="Time" active={Boolean(time)} />
                <TrueFalseIndicator label="Setting" active={Boolean(setting)} />
                <TrueFalseIndicator
                  label="Description"
                  active={Boolean(description)}
                />
              </>
            )}
          </promptForm.Subscribe>
        </div>
        <div className="flex flex-col gap-4">
          <BtnAuth
            className="group"
            onClick={() => navigate('library?type=character')}
          >
            Picture Library
          </BtnAuth>
          <promptForm.Subscribe selector={(state) => state.values}>
            {(values) => {
              const complete = Object.values(values)
                .map((value) => !!value)
                .every(Boolean);

              return complete ? (
                <>
                  <BtnAuth
                    className="group"
                    onClick={() => {
                      navigate('prompt');
                    }}
                  >
                    Set Prompt Info
                  </BtnAuth>
                  <BtnRect
                    className="group"
                    ariaLabel="Generate picture"
                    onClick={() => {
                      promptForm.handleSubmit();
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
                </>
              ) : (
                <BtnRect
                  className="group"
                  ariaLabel="Generate picture"
                  onClick={() => {
                    navigate('prompt');
                  }}
                >
                  Set Prompt Info
                </BtnRect>
              );
            }}
          </promptForm.Subscribe>
        </div>
      </div>
      {(path.includes('library') || path.includes('prompt')) && (
        <Outlet context={{ type, form, promptForm, generatePicture }} />
      )}
    </div>
  );
};

export default PictureField;
