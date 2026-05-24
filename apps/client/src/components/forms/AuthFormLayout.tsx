import { ReactNode } from 'react';
import useAuthPictureQuery from 'src/hooks/useAuthPictureQuery/useAuthPictureQuery';
import CloudinaryPicture from '../CloudinaryPicture';
import { FormApi } from '@tanstack/react-form';

const AuthFormLayout = ({
  form,
  children,
}: {
  form: FormApi;
  children: ReactNode;
}) => {
  const { data: picture } = useAuthPictureQuery();

  return (
    <div className="shadow-color bg-base grid grid-cols-2 overflow-hidden rounded-lg shadow-lg">
      <form
        className="flex w-full flex-col justify-between gap-8 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          form.handleSubmit();
        }}
      >
        {children}
      </form>
      <CloudinaryPicture className="aspect-square" publicId={picture?.url} />
    </div>
  );
};

export default AuthFormLayout;
