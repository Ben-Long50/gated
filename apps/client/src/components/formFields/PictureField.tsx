import { FormApi } from '@tanstack/react-form';
import ThemeContainer from '../ThemeContainer';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiCloseBox, mdiImagePlus, mdiMinus, mdiPlus } from '@mdi/js';
import useGeneratePictureMutation from 'src/hooks/useGeneratePictureMutation/useGeneratePictureMutation';
import TextAreaField from './TextAreaField';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import IconBtnSmall from '../buttons/IconBtnSmall';

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

  const [prompt, setPrompt] = useState('');

  const generatePicture = useGeneratePictureMutation();

  useEffect(() => {
    if (generatePicture.data) {
      form.setFieldValue(
        'picture.imageUrl',
        generatePicture.data.picture.imageUrl,
      );

      form.setFieldValue(
        'picture.publicId',
        generatePicture.data.picture.publicId,
      );

      form.setFieldValue('pictureFile', null);
    }
  }, [generatePicture.data]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];

    if (selectedFile) {
      form.setFieldValue('pictureFile', selectedFile);

      const fileUrl = URL.createObjectURL(selectedFile);

      form.setFieldValue('picture.imageUrl', fileUrl);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:gap-6">
      <div className="flex h-full flex-col gap-4 sm:gap-6">
        <ThemeContainer
          className="mx-auto my-auto w-full max-w-3xl"
          chamfer="medium"
          borderColor={accentPrimary}
          overflowHidden={true}
        >
          <form.Subscribe selector={(state) => state.values.picture}>
            {(picture) =>
              !picture.imageUrl ? (
                <label
                  className="bg-secondary flex w-full cursor-pointer flex-col items-center justify-center"
                  style={sizeInfo}
                >
                  <div className="flex flex-col items-center justify-center gap-2 pb-6 pt-5">
                    <Icon
                      className="text-tertiary"
                      path={mdiImagePlus}
                      size={3}
                    />
                    <p className="text-tertiary font-semibold">
                      Upload Picture
                    </p>
                    <p className="text-tertiary">PNG, JPG, JPEG</p>
                  </div>
                  <input
                    id="file"
                    type="file"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div
                  className="bg-secondary h-full w-full overflow-hidden bg-black"
                  style={{
                    aspectRatio: sizeInfo.aspectRatio,
                    maxHeight: sizeInfo.maxHeight,
                    minHeight: sizeInfo.minHeight,
                  }}
                >
                  <img
                    className="h-full w-full object-cover"
                    src={picture.imageUrl}
                    alt="Preview"
                    style={{
                      objectPosition: `${picture.position.x}% ${picture.position.y}%`,
                    }}
                  />
                  <button
                    className="text-secondary absolute right-2 top-2 rounded-md bg-zinc-900"
                    onClick={() => {
                      form.setFieldValue('picture', {
                        ...picture,
                        imageUrl: '',
                        publicId: '',
                      });
                    }}
                  >
                    <Icon path={mdiCloseBox} size={1.5} />
                  </button>
                </div>
              )
            }
          </form.Subscribe>
        </ThemeContainer>
        <form.Field name="picture.position.y">
          {(field) => (
            <div className="flex items-center justify-between gap-4">
              <IconBtnSmall
                active={field.state.value > 0}
                onClick={() => field.handleChange((prev) => prev - 10)}
              >
                <Icon path={mdiMinus} />
              </IconBtnSmall>
              <p>Vertical Position ({field.state.value})</p>
              <IconBtnSmall
                active={field.state.value < 100}
                onClick={() => field.handleChange((prev) => prev + 10)}
              >
                <Icon path={mdiPlus} />
              </IconBtnSmall>
            </div>
          )}
        </form.Field>
        <BtnRect
          className="group"
          ariaLabel="Generate picture"
          onClick={() => navigate('library')}
        >
          Picture Library
        </BtnRect>
        <BtnRect
          className="group"
          ariaLabel="Generate picture"
          onClick={() => {
            navigate('prompt');
            // if (!generatePicture.isPending) {
            //   generatePicture.mutate(prompt);
            // }
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
        {(path.includes('library') || path.includes('prompt')) && (
          <Outlet context={{ form }} />
        )}
      </div>
    </div>
  );
};

export default PictureField;
