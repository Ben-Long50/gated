import { useContext } from 'react';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import AffiliationBar from '../AffiliationBar';
import { Faction } from 'src/types/faction';
import useCreateAffiliationMutation from '../../hooks/useCreateAffiliationMutation/useCreateAffiliationMutation';
import { LayoutContext } from '../../contexts/LayoutContext';
import useAffiliationQuery from '../../hooks/useAffiliationQuery/useAffiliationQuery';
import useDeleteAffiliationMutation from '../../hooks/useDeleteAffiliationMutation/useDeleteAffiliationMutation';
import useAffiliationForm from 'src/hooks/form hooks/useAffiliationForm';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useGangQueries from 'src/hooks/gang hooks/useGangQueries/useGangQueries';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';
import useFactionQueries from 'src/hooks/faction hooks/useFactionQueries';
import { Gang } from 'src/types/gang';
import { Character } from 'src/types/character';
import BtnAuth from '../buttons/BtnAuth';
import EntityCard from '../EntityCard';

const AffiliationForm = () => {
  const { mobile } = useContext(LayoutContext);
  const { campaignId, factionId, gangId, characterId, affiliationId } =
    useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const { factions, isLoading: factionsLoading } = useFactionQueries(
    campaign?.factions.map((faction) => faction.id) || [],
  );

  const { gangs, isLoading: gangsLoading } = useGangQueries(
    campaign?.gangs.map((gang) => gang.id) || [],
  );

  const { characters, isLoading: charactersLoading } = useCharacterQueries(
    campaign?.characters.map((character) => character.id) || [],
  );

  const { data: affiliation, isLoading: affiliationLoading } =
    useAffiliationQuery(Number(affiliationId));

  const createAffiliation = useCreateAffiliationMutation();

  const deleteAffiliation = useDeleteAffiliationMutation(Number(affiliationId));

  const affiliationForm = useAffiliationForm(createAffiliation, affiliation);

  if (
    affiliationLoading ||
    campaignLoading ||
    factionsLoading ||
    gangsLoading ||
    charactersLoading
  ) {
    return <Loading />;
  }

  return (
    <FormLayout
      label="Affiliation"
      form={affiliationForm}
      itemId={affiliationId}
      createMutation={createAffiliation}
      deleteMutation={deleteAffiliation}
    >
      <BtnAuth onClick={() => navigate('selectEntities')}>
        Select Affiliation Entities
      </BtnAuth>
      {parts.includes('selectEntities') && (
        <Outlet context={{ form: affiliationForm }} />
      )}
      <affiliationForm.Subscribe
        selector={(state) => [
          state.values.factionIds,
          state.values.gangIds,
          state.values.characterIds,
        ]}
      >
        {([factionIds, gangIds, characterIds]) => (
          <div className="flex flex-col gap-4">
            {factionIds.map((factionId: number) => {
              const faction = factions.find(
                (faction: Faction) => faction.id === factionId,
              );
              return <EntityCard entity={faction} />;
            })}
            {gangIds.map((gangId: number) => {
              const gang = gangs.find((gang: Gang) => gang.id === gangId);
              return <EntityCard entity={gang} />;
            })}
            {characterIds.map((characterId: number) => {
              const character = characters.find(
                (character: Character) => character.id === characterId,
              );
              return <EntityCard entity={character} />;
            })}
          </div>
        )}
      </affiliationForm.Subscribe>
      <div>
        <affiliationForm.Field name="value">
          {(field) => <AffiliationBar field={field} />}
        </affiliationForm.Field>
      </div>
    </FormLayout>
  );
};

export default AffiliationForm;
