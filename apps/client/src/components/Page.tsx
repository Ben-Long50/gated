import { LayoutContext } from 'src/contexts/LayoutContext';
import Container from './Container';
import { ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

const Page = ({
  title,
  children,
  context,
}: {
  title?: string;
  children: ReactNode;
  context?: any;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <>
      <div
        className={`${mobile ? 'gap-4' : 'gap-8'} flex w-full max-w-8xl flex-col items-center`}
      >
        <h1>{title}</h1>
        <Container>{children}</Container>
      </div>
      <Outlet context={context} />
    </>
  );
};

export default Page;
