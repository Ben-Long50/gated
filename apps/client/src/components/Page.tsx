import { LayoutContext } from 'src/contexts/LayoutContext';
import Container from './Container';
import { ReactNode, useContext } from 'react';
import { Outlet } from 'react-router-dom';

const Page = ({
  title,
  children,
  context,
  container = true,
}: {
  title?: string;
  children: ReactNode;
  context?: any;
  container?: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <>
      {container ? (
        <div
          className={`${mobile ? 'gap-4' : 'gap-8'} max-w-8xl flex w-full flex-col items-center`}
        >
          <h1>{title}</h1>
          <Container>{children}</Container>
        </div>
      ) : (
        children
      )}
      <Outlet context={context} />
    </>
  );
};

export default Page;
