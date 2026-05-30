import { FormApi, useStore } from '@tanstack/react-form';
import ThemeContainer from '../ThemeContainer';
import { useContext, useEffect } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiMinus, mdiPlus } from '@mdi/js';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import IconBtnSmall from '../buttons/IconBtnSmall';
import BtnAuth from '../buttons/BtnAuth';
import { PictureCard } from '../PictureCard';
import TrueFalseIndicator from '../TrueFalseIndicator';
import CloudinaryPicture from '../CloudinaryPicture';
import useGenerateItemPictureMutation from 'src/hooks/useGenerateItemPictureMutation/useGenerateItemPictureMutation';
import useItemPromptForm from 'src/hooks/form hooks/useItemPromptForm';

type SizeInfo = {
  aspectRatio: string;
  minHeight: string;
  maxHeight: string;
};

const ItemPictureField = ({
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

  const generatePicture = useGenerateItemPictureMutation();

  const promptForm = useItemPromptForm(generatePicture);

  useEffect(() => {
    if (generatePicture.data) {
      form.setFieldValue('picture', (prev) => ({
        ...prev,
        imageUrl: generatePicture.data.pictures[0].imageUrl,
        publicId: generatePicture.data.pictures[0].publicId,
      }));
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
                  key={picture.publicId}
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
            <promptForm.Subscribe selector={(state) => state.values}>
              {(values) => (
                <>
                  <TrueFalseIndicator label="Time" active={values.time} />
                  <TrueFalseIndicator label="Setting" active={values.setting} />
                  <TrueFalseIndicator
                    label="Description"
                    active={values.itemDescription}
                  />
                  <TrueFalseIndicator
                    label="Arrangement"
                    active={values.itemArrangement}
                  />
                </>
              )}
            </promptForm.Subscribe>
          </div>
          <div className="flex flex-col gap-4">
            <BtnAuth
              className="group"
              onClick={() => navigate('library?type=item')}
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
          <Outlet context={{ form, promptForm }} />
        )}
      </div>
    </div>
  );
};

export default ItemPictureField;
