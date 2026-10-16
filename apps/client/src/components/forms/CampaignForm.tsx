import InputField from '../formFields/InputField';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { useNavigate, useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import useCreateCampaignMutation from '../../hooks/useCreateCampaignMutation/useCreateCampaignMutation';
import ArrowHeader2 from '../ArrowHeader2';
import AffiliationBar from '../AffiliationBar';
import Divider from '../Divider';
import useCampaignQuery from '../../hooks/useCampaignQuery/useCampaignQuery';
import useDeleteCampaignMutation from '../../hooks/useDeleteCampaignMutation/useDeleteCampaignMutation';
import PictureField from '../formFields/PictureField';
import AccountPicture from '../AccountPicture';
import InputSelectField from '../formFields/InputSelectField';
import useCampaignForm from 'src/hooks/form hooks/useCampaignForm';
import useUserQueries from 'src/hooks/user hooks/useUserQueries';
import { useStore } from '@tanstack/react-form';
import BtnAuth from '../buttons/BtnAuth';
import ArrowHeader4 from '../ArrowHeader4';
import Page from '../Page';
import { User } from '@gated/shared';

const CampaignForm = () => {
  const { campaignId } = useParams();
  const navigate = useNavigate();

  const createCampaign = useCreateCampaignMutation();

  const deleteCampaign = useDeleteCampaignMutation(Number(campaignId));

  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  const campaignForm = useCampaignForm(createCampaign, campaign);

  const playerIds = useStore(
    campaignForm.store,
    (state) => state.values.playerIds,
  );
  const pendingPlayerIds = useStore(
    campaignForm.store,
    (state) => state.values.pendingPlayerIds,
  );

  const { data: players } = useUserQueries(playerIds);
  const { data: pendingPlayers } = useUserQueries(pendingPlayerIds);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Page
      title="Update Campaign"
      context={{ form: campaignForm, type: 'scene' }}
    >
      <FormLayout
        label="Campaign"
        form={campaignForm}
        itemId={campaignId}
        createMutation={createCampaign}
        deleteMutation={deleteCampaign}
      >
        <ArrowHeader2 title="Campaign Information" />
        <campaignForm.Field name="name">
          {(field) => (
            <InputField
              label="Campaign name"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </campaignForm.Field>
        <campaignForm.Field name="location">
          {(field) => (
            <InputField
              label="Campaign location (City Name)"
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </campaignForm.Field>
        <PictureField type="scene" form={campaignForm} />
        <Divider />
        <ArrowHeader2 title="Campaign Factions" />
        <campaignForm.Field name="factions" mode="array">
          {(field) => (
            <div className="flex w-full flex-col gap-4 lg:gap-8">
              {field.state.value.map((_, i: number) => {
                return (
                  <div className="flex w-full flex-col gap-4" key={i}>
                    <campaignForm.Field name={`factions[${i}].factionType`}>
                      {(subfield) => (
                        <InputSelectField
                          label="Faction type"
                          options={[
                            'churchOfElShaddai',
                            'corporateHoldouts',
                            'federalReservists',
                            'noblebloods',
                          ]}
                          value={subfield.state.value}
                          onChange={(value) => subfield.handleChange(value)}
                        />
                      )}
                    </campaignForm.Field>
                    <campaignForm.Field name={`factions[${i}].name`}>
                      {(subfield) => (
                        <InputField
                          label="Faction name"
                          value={subfield.state.value}
                          onChange={(value) => subfield.handleChange(value)}
                        />
                      )}
                    </campaignForm.Field>
                  </div>
                );
              })}
            </div>
          )}
        </campaignForm.Field>
        {!campaignId && (
          <>
            <p>Starting Faction Affiliation</p>
            <campaignForm.Field name="affiliation">
              {(field) => <AffiliationBar field={field} />}
            </campaignForm.Field>
            <div className="flex flex-col gap-8">
              <Divider />
              <ArrowHeader2 title="Session 0 Briefing" />
              <campaignForm.Field name="briefing">
                {(field) => (
                  <>
                    <LexicalEditor field={field} />
                    {field.state.meta.errors &&
                      field.state.meta.errors.map((error, index) => (
                        <p
                          key={index}
                          className="timing text-error text-base italic leading-5"
                          role="alert"
                        >
                          {error}
                        </p>
                      ))}
                  </>
                )}
              </campaignForm.Field>
            </div>
          </>
        )}
        <Divider />
        <ArrowHeader2 title="Selected Players" />
        {[...playerIds, ...pendingPlayerIds].length > 0 && (
          <div className="flex flex-col gap-4">
            {players
              .filter((p) => p != null)
              .map((player: User) => (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AccountPicture user={player} />
                    <ArrowHeader4
                      className="text-primary"
                      title={player.username}
                    />
                  </div>
                  <p>Confirmed</p>
                </div>
              ))}
            {pendingPlayers
              .filter((p) => p != null)
              .map((player: User) => (
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-4">
                    <AccountPicture user={player} />
                    <ArrowHeader4
                      className="text-primary"
                      title={player.username}
                    />
                  </div>
                  <p className="text-tertiary">Pending</p>
                </div>
              ))}
          </div>
        )}
        <BtnAuth onClick={() => navigate('modal/managePlayers')}>
          Select Campaign Players
        </BtnAuth>
      </FormLayout>
    </Page>
  );
};

export default CampaignForm;
