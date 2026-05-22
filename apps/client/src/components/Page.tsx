import Container from './Container';
import { ReactNode } from 'react';

const Page = ({ title, children }: { title?: string; children: ReactNode }) => {
  return (
    <div className="flex w-full max-w-8xl flex-col items-center gap-8">
      <h1>{title}</h1>
      <Container>{children}</Container>
    </div>
  );
};

export default Page;
