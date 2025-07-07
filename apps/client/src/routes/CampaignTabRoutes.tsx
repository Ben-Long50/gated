import { Route } from 'react-router-dom';
import Campaign from 'src/components/Campaign';
import CampaignCharacterList from 'src/components/CampaignCharacterList';
import CampaignForm from 'src/components/CampaignForm';
import Campaigns from 'src/components/Campaigns';
import Faction from 'src/components/Faction';
import FactionForm from 'src/components/FactionForm';
import RollSimulator from 'src/components/RollSimulator';
import SessionRoutes from './SessionRoutes';
import { CampaignSocketProvider } from 'src/contexts/CampaignSocketContext';
import CampaignAffiliations from 'src/components/CampaignAffiliations';
import RollModal from 'src/components/modals/RollModal';
import CharacterRoutes from './CharacterRoutes';
import DescriptionModal from 'src/components/modals/DescriptionModal';
import Notes from 'src/components/Notes';
import CalendarModal from 'src/components/modals/CalendarModal';
import EventForm from 'src/components/EventForm';
import TimeModal from 'src/components/modals/TimeModal';
import MapBuilder from 'src/components/maps/MapBuilder';

const CampaignTabRoutes = () => {
  return (
    <Route path="campaigns">
      <Route path="" element={<Campaigns />} />
      <Route path=":campaignId" element={<CampaignSocketProvider />}>
        <Route path="" element={<Campaign />}>
          <Route
            path="conditions/:conditionId"
            element={<DescriptionModal />}
          />
          <Route path="calendar/time" element={<TimeModal />} />
          <Route path="calendar/:month/:day" element={<CalendarModal />} />
          <Route path="calendar/:month/:day/newEvent" element={<EventForm />} />
        </Route>
        <Route
          path="update"
          element={<CampaignForm title="Update" mode="update" />}
        />
        <Route path="factions/:factionId">
          <Route index element={<Faction />} />
          <Route
            path="update"
            element={<FactionForm title="Update" mode="update" />}
          />
        </Route>
        <Route path="characters">
          <Route path="" element={<CampaignCharacterList />}>
            <Route
              path="conditions/:conditionId"
              element={<DescriptionModal />}
            />
          </Route>
          <Route path=":characterId/notes" element={<Notes />} />
          {CharacterRoutes()}
        </Route>
        {SessionRoutes()}
        <Route path="maps" element={<CampaignAffiliations />} />
        <Route path="maps/create" element={<MapBuilder />} />
        <Route path="affiliations" element={<CampaignAffiliations />} />
        <Route path="rollSimulator" element={<RollSimulator />}>
          <Route path="rollResults" element={<RollModal />} />
        </Route>
      </Route>
      <Route
        path="create"
        element={<CampaignForm title="Create" mode="create" />}
      />
      <Route path="rollSimulator" element={<RollSimulator />}>
        <Route path="rollResults" element={<RollModal />} />
      </Route>
    </Route>
  );
};

export default CampaignTabRoutes;
