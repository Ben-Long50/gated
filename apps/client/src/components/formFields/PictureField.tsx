import { FormApi } from '@tanstack/react-form';
import ThemeContainer from '../ThemeContainer';
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from 'src/contexts/ThemeContext';
import Icon from '@mdi/react';
import { mdiCloseBox, mdiImagePlus } from '@mdi/js';
import useGeneratePictureMutation from 'src/hooks/useGeneratePictureMutation/useGeneratePictureMutation';
import TextAreaField from './TextAreaField';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';

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

  const [aspectRatio, setAspectRatio] = useState(sizeInfo.aspectRatio);
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
      <div className="grid w-full grid-cols-2 items-center gap-4 sm:gap-6">
        <div className="flex h-full flex-col gap-4 sm:gap-6">
          <ThemeContainer
            className="mx-auto my-auto w-full"
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
                      aspectRatio,
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
          <BtnRect
            className="group"
            ariaLabel="Generate picture"
            onClick={() => navigate('library')}
          >
            Picture Library
          </BtnRect>
          {path.includes('library') && <Outlet context={{ form }} />}
        </div>
        <div className="flex h-full flex-col gap-4 sm:gap-6">
          <TextAreaField
            label="Picture Prompt"
            value={prompt}
            onChange={(value) => setPrompt(value)}
          />
          <BtnRect
            className="group"
            ariaLabel="Generate picture"
            onClick={() => {
              if (!generatePicture.isPending) {
                generatePicture.mutate(prompt);
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
        </div>
      </div>
      {/* <div className="items-centerv flex w-full flex-col items-start justify-between gap-4">
        <ArrowHeader4 className="text-primary" title="Aspect Ratio Previews" />
        <div className="grid w-full grid-cols-3 items-center gap-4">
          <button
            className={`${aspectRatio === '1/1' ? 'text-accent' : 'text-tertiary'} bg-tertiary timing hover:text-accent shadow-color rounded-md p-2 text-center font-semibold shadow-md`}
            onClick={(e) => {
              e.preventDefault();
              setAspectRatio('1/1');
            }}
          >
            1 : 1
          </button>
          <button
            className={`${aspectRatio === '5/4' ? 'text-accent' : 'text-tertiary'} bg-tertiary timing hover:text-accent shadow-color rounded-md p-2 text-center font-semibold shadow-md`}
            onClick={(e) => {
              e.preventDefault();
              setAspectRatio('5/4');
            }}
          >
            5 : 4
          </button>
          <button
            className={`${aspectRatio === '10/3' ? 'text-accent' : 'text-tertiary'} bg-tertiary timing hover:text-accent shadow-color rounded-md p-2 text-center font-semibold shadow-md`}
            onClick={(e) => {
              e.preventDefault();
              setAspectRatio('10/3');
            }}
          >
            10 : 3
          </button>
        </div>
      </div>
      <form.Field name="picture.position.y">
        {(field) => (
          <label className="flex flex-col gap-4" htmlFor="position">
            <div className="flex justify-between">
              <ArrowHeader4
                className="text-primary"
                title="Picture Position (Vertical)"
              />
              <h4>{field.state.value}%</h4>
            </div>
            <input
              id="position"
              name="picture.position.y"
              className="w-full"
              onChange={(e) => field.handleChange(Number(e.target.value))}
              value={field.state.value}
              type="range"
              min={0}
              max={100}
            />
          </label>
        )}
      </form.Field> */}
    </div>
  );
};

export default PictureField;
