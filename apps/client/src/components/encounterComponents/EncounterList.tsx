import { capitalCase } from 'change-case';
import { Fragment, useContext, useRef } from 'react';
import {
  Outlet,
  useLocation,
  useParams,
  useSearchParams,
} from 'react-router-dom';
import Loading from '../Loading';
import ItemCardSmall from '../ItemCardSmall';
import BtnRect from '../buttons/BtnRect';
import Divider from '../Divider';
import CloudinaryPicture from '../CloudinaryPicture';
import useCombatQueries from 'src/hooks/encounter hooks/useCombatQueries/useCombatQueries';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardSmall from '../characterComponents/CharacterCardSmall';
import ArrowHeader3 from '../ArrowHeader3';
import { CampaignContext } from 'src/contexts/CampaignContext';
import useActivateEncounterMutation from 'src/hooks/encounter hooks/useActivateEncounterMutation/useActivateEncounterMutation';
import ArrowHeader2 from '../ArrowHeader2';
import Page from '../Page';
import useParts from 'src/hooks/useParts';
import useDeleteEncounterMutation from 'src/hooks/useDeleteEncounterMutation/useDeleteEncounterMutation';

const EncounterList = () => {
  const { mapId, campaignId } = useParams();
  const { gameMaster } = useContext(CampaignContext);

  const { parts } = useParts();
  const [searchParams] = useSearchParams();

  const activateEncounter = useActivateEncounterMutation(Number(campaignId));
  const deleteEncounter = useDeleteEncounterMutation(Number(campaignId));

  const type = searchParams.get('type') ?? '';

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const {
    activeEncounters,
    pendingEncounters,
    completedEncounters,
    isLoading,
  } = useCombatQueries(campaign?.encounters.map((encounter) => encounter.id));

  let encounters = [] as any[];

  switch (type) {
    case 'active':
      encounters = activeEncounters;
      break;
    case 'pending':
      encounters = pendingEncounters;
      break;
    case 'completed':
      encounters = completedEncounters;
      break;
    default:
      encounters = [];
      break;
  }

  if (campaignLoading || isLoading) return <Loading />;

  return (
    <Page title={`${capitalCase(type)} Encounters`}>
      {encounters.length === 0 ? (
        <>
          <p className="text-center">No encounters found</p>
        </>
      ) : (
        <div className="flex w-full flex-col gap-4">
          {encounters.map((encounter) => {
            return (
              <Fragment key={encounter.id}>
                <ArrowHeader2 title={encounter.name} />
                <Divider />
                <div className="grid grid-cols-2 gap-8">
                  <div className="col-span-2 flex w-full flex-col items-start gap-4">
                    <ArrowHeader3 title={encounter.map.name} />
                    <CloudinaryPicture
                      className="border-accent max-h-80 overflow-hidden rounded border"
                      publicId={encounter.map.generatedPicture.publicId}
                    />
                  </div>
                  <div className="flex flex-col gap-4">
                    <ArrowHeader3 title="Player Characters" />
                    {encounter.characters
                      .filter((character) => character.playerCharacter)
                      .map((character) => (
                        <CharacterCardSmall
                          characterList={true}
                          characterId={character.id}
                          active={false}
                        />
                      ))}
                  </div>
                  <div className="flex flex-col gap-4">
                    <ArrowHeader3 title="Non-Player Characters" />
                    {encounter.characters
                      .filter((character) => !character.playerCharacter)
                      .map((character) => (
                        <CharacterCardSmall
                          characterList={true}
                          characterId={character.id}
                          active={false}
                        />
                      ))}
                  </div>
                </div>
                <Divider />
                {gameMaster && (
                  <>
                    <BtnRect
                      className="group"
                      type="button"
                      ariaLabel="Begin encounter"
                      onClick={() => {
                        activateEncounter.mutate(encounter.id);
                      }}
                    >
                      {activateEncounter.isPending ? (
                        <Loading
                          className="group-hover:text-accent"
                          size={1.15}
                        />
                      ) : (
                        'Begin Encounter'
                      )}
                    </BtnRect>
                    <BtnRect
                      className="group"
                      type="button"
                      ariaLabel="Begin encounter"
                      onClick={() => {
                        deleteEncounter.mutate(encounter.id);
                      }}
                    >
                      {deleteEncounter.isPending ? (
                        <Loading
                          className="group-hover:text-accent"
                          size={1.15}
                        />
                      ) : (
                        'Delete Encounter'
                      )}
                    </BtnRect>
                  </>
                )}
                {encounter.map.id === Number(mapId) && (
                  <Outlet context={{ name: encounter.map.name, parts }} />
                )}
              </Fragment>
            );
          })}
        </div>
      )}
    </Page>
  );
};

export default EncounterList;
