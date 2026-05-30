import { FormApi, useStore } from '@tanstack/react-form';
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

type SizeInfo = {
  aspectRatio: string;
  minHeight: string;
  maxHeight: string;
};

const PictureField = ({
  form,
  sizeInfo,
}: {
  form: FormApi;
  sizeInfo: SizeInfo;
}) => {
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const path = location.pathname.split('/');

  const generatePicture = useGeneratePictureMutation();

  const sex = useStore(form.store, (state) => state.values.sex);

  const promptForm = usePromptForm(generatePicture, {
    sex,
  });

  useEffect(() => {
    if (generatePicture.data) {
      form.setFieldValue(
        'picture.imageUrl',
        generatePicture.data.pictures[0].imageUrl,
      );

      form.setFieldValue(
        'picture.publicId',
        generatePicture.data.pictures[0].publicId,
      );

      form.setFieldValue('pictureFile', null);
    }
  }, [generatePicture.data]);

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="grid h-full grid-cols-2 flex-col gap-4 sm:gap-6">
        <div className="flex flex-col gap-8">
          <ThemeContainer
            className="mx-auto my-auto w-full max-w-3xl"
            chamfer="medium"
            borderColor={accentPrimary}
            overflowHidden={true}
          >
            <form.Subscribe selector={(state) => state.values.picture}>
              {(picture) => (
                <CloudinaryPicture
                  className="bg-secondary h-full w-full overflow-hidden bg-black"
                  publicId={picture.publicId}
                  style={{
                    aspectRatio: sizeInfo.aspectRatio,
                    maxHeight: sizeInfo.maxHeight,
                    minHeight: sizeInfo.minHeight,
                  }}
                />
              )}
            </form.Subscribe>
          </ThemeContainer>
          <promptForm.Subscribe selector={(state) => state.values.pictureCount}>
            {(pictureCount) => (
              <div className="grid grid-cols-4 gap-4">
                <form.Field name="picture">
                  {(field) =>
                    Array.from({ length: pictureCount }).map((_, index) => {
                      const picture = generatePicture.data
                        ? generatePicture.data.pictures[index]
                        : null;

                      return picture ? (
                        <PictureCard
                          key={index}
                          label={
                            field.state.value.publicId === picture.publicId
                              ? 'Selected'
                              : undefined
                          }
                          publicId={picture.publicId}
                          onClick={() =>
                            field.handleChange((prev) => ({
                              ...prev,
                              imageUrl: picture.imageUrl,
                              publicId: picture.publicId,
                            }))
                          }
                        />
                      ) : (
                        <PictureCard
                          label=""
                          color={accentPrimary}
                          key={index}
                        />
                      );
                    })
                  }
                </form.Field>
              </div>
            )}
          </promptForm.Subscribe>
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
          <div className="flex flex-col gap-3 border-x-2 border-x-gray-400 border-opacity-50 px-4">
            <form.Subscribe selector={(state) => state.values.sex}>
              {(sex) => (
                <>
                  <TrueFalseIndicator label="Sex" active={sex} />
                </>
              )}
            </form.Subscribe>
            <promptForm.Subscribe selector={(state) => state.values}>
              {(values) => (
                <>
                  <TrueFalseIndicator label="Height" active={values.height} />
                  <TrueFalseIndicator label="Build" active={values.build} />
                  <TrueFalseIndicator label="Age" active={values.age} />
                  <TrueFalseIndicator label="Time" active={values.time} />
                  <TrueFalseIndicator label="Setting" active={values.setting} />
                  <TrueFalseIndicator label="Hair" active={values.hair} />
                  <TrueFalseIndicator label="Outfit" active={values.outfit} />
                  <TrueFalseIndicator
                    label="Augmentation"
                    active={values.augmentation}
                  />
                  <TrueFalseIndicator label="Weapon" active={values.weapon} />
                  <TrueFalseIndicator label="Pose" active={values.pose} />
                </>
              )}
            </promptForm.Subscribe>
          </div>
          <div className="flex flex-col gap-4">
            <BtnAuth className="group" onClick={() => navigate('library')}>
              Picture Library
            </BtnAuth>
            <form.Subscribe selector={(state) => state.values.sex}>
              {(sex) => (
                <promptForm.Subscribe selector={(state) => state.values}>
                  {(values) => {
                    const compiledValues = {
                      ...values,
                      sex,
                    };

                    console.log(compiledValues);

                    const complete = Object.values(compiledValues)
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
              )}
            </form.Subscribe>
          </div>
        </div>
        {(path.includes('library') || path.includes('prompt')) && (
          <Outlet context={{ form, promptForm }} />
        )}
      </div>
    </div>
  );
};

export default PictureField;
