import { ReactNode, useContext } from 'react';
import useAuthPictureQuery from 'src/hooks/useAuthPictureQuery/useAuthPictureQuery';
import CloudinaryPicture from '../CloudinaryPicture';
import { FormApi } from '@tanstack/react-form';
import { LayoutContext } from 'src/contexts/LayoutContext';

const AuthFormLayout = ({
  form,
  children,
}: {
  form: FormApi;
  children: ReactNode;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { data: picture } = useAuthPictureQuery();

  return (
    <>
      {!mobile && (
        <CloudinaryPicture
          className="absolute w-full"
          publicId={picture?.publicId}
        />
      )}
      <div
        className={`shadow-color bg-base z-10 w-full max-w-[600px] overflow-hidden rounded-lg shadow-lg`}
      >
        <form
          className={`${mobile ? 'gap-6 p-4' : 'gap-8 p-8'} flex flex-col justify-between`}
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
        >
          {children}
        </form>
      </div>
    </>
  );
};

export default AuthFormLayout;
