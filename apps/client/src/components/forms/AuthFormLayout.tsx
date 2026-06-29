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
    <div
      className={`${!mobile && 'grid grid-cols-2'} shadow-color bg-base w-full overflow-hidden rounded-lg shadow-lg`}
    >
      <form
        className={`${mobile ? 'gap-6 p-4' : 'gap-8 p-8'} flex w-full flex-col justify-between`}
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {children}
      </form>
      {!mobile && (
        <CloudinaryPicture className="aspect-square" publicId={picture?.url} />
      )}
    </div>
  );
};

export default AuthFormLayout;
