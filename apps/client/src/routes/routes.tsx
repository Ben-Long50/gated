import App from '../App';
import ErrorPage from '../components/ErrorPage';
import {
  Navigate,
  Route,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import AuthLayout from '../layouts/AuthLayout';
import SigninForm from '../components/forms/SigninForm';
import SignupForm from '../components/forms/SignupForm';
import MainLayout from '../layouts/MainLayout';
import ErrorReport from '../components/ErrorReport';
import ErrorReports from '../components/ErrorReports';
import AccountTabRoutes from './AccountTabRoutes';
import CampaignTabRoutes from './CampaignTabRoutes';
import CharacterTabRoutes from './CharacterTabRoutes';
import CodexTabRoutes from './CodexTabRoutes';
import RollModal from 'src/components/modals/RollModal';
import { CampaignProvider } from 'src/contexts/CampaignContext';
import SocialTabRoutes from './SocialTabRoutes';
import MapTabRoutes from './MapTabRoutes';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<App />}>
        <Route element={<AuthLayout />}>
          <Route index element={<Navigate to="signin" replace />} />
          <Route path="signup" element={<SignupForm />} />
          <Route path="signin" element={<SigninForm />} />
        </Route>
        <Route
          path="glam"
          element={
            <CampaignProvider>
              <MainLayout />
            </CampaignProvider>
          }
          errorElement={<ErrorPage />}
        >
          <Route path="error">
            <Route index element={<ErrorReports />} />
          </Route>
          {AccountTabRoutes()}
          {SocialTabRoutes()}
          {CampaignTabRoutes()}
          {CharacterTabRoutes()}
          {CodexTabRoutes()}
          {MapTabRoutes()}
          <Route path="rollResults" element={<RollModal />} />
        </Route>
      </Route>
      ,
    </>,
  ),
);

export default router;
