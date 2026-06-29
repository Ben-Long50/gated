import { LayoutContext } from 'src/contexts/LayoutContext';
import Container from './Container';
import { ReactNode, useContext } from 'react';

const Page = ({ title, children }: { title?: string; children: ReactNode }) => {
  const { mobile } = useContext(LayoutContext);

  return (
    <div
      className={`${mobile ? 'gap-4' : 'gap-8'} flex w-full max-w-8xl flex-col items-center`}
    >
      <h1>{title}</h1>
      <Container>{children}</Container>
    </div>
  );
};

export default Page;
