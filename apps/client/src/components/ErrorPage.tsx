import { useNavigate, useRouteError } from 'react-router-dom';
import BtnRect from './buttons/BtnRect';
import Page from './Page';

const ErrorPage = () => {
  const error = useRouteError();
  const navigate = useNavigate();
  return (
    <div className="flex h-dvh w-dvw items-center justify-center">
      <Page>
        <h2 className="text-center">Error</h2>
        <p className="text-error text-center">{error.message}</p>
        <BtnRect
          type="button"
          ariaLabel="Back"
          className="w-full"
          onClick={() => navigate(-1)}
        >
          Go back
        </BtnRect>
      </Page>
    </div>
  );
};

export default ErrorPage;
