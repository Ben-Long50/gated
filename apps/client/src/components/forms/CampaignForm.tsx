import { useState } from 'react';
import InputField from '../InputField';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import InputFieldBasic from '../InputFieldBasic';
import { User } from 'src/types/user';
import { useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import useUsersQuery from '../../hooks/useUsersQuery/useUsersQuery';
import ItemCardSmall from '../ItemCardSmall';
import useCreateCampaignMutation from '../../hooks/useCreateCampaignMutation/useCreateCampaignMutation';
import ArrowHeader2 from '../ArrowHeader2';
import AffiliationBar from '../AffiliationBar';
import Divider from '../Divider';
import useCampaignQuery from '../../hooks/useCampaignQuery/useCampaignQuery';
import useDeleteCampaignMutation from '../../hooks/useDeleteCampaignMutation/useDeleteCampaignMutation';
import PictureField from '../formFields/PictureField';
import AccountPicture from '../AccountPicture';
import InputSelectField from '../InputSelectField';
import useCampaignForm from 'src/hooks/form hooks/useCampaignForm';

const CampaignForm = () => {
  const { campaignId } = useParams();
  const [nameQuery, setNameQuery] = useState('');

  const createCampaign = useCreateCampaignMutation(Number(campaignId));

  const deleteCampaign = useDeleteCampaignMutation(Number(campaignId));

  const { data: campaign, isLoading } = useCampaignQuery(Number(campaignId));

  const {
    data: users,
    isLoading: usersLoading,
    isPending: usersPending,
  } = useUsersQuery(nameQuery);

  const campaignForm = useCampaignForm(createCampaign, campaign);

  if (isLoading) return <Loading />;

  return (
    <FormLayout
      label="Campaign"
      form={campaignForm}
      itemId={campaignId}
      createMutation={createCampaign}
      deleteMutation={deleteCampaign}
    >
      <ArrowHeader2 title="Campaign Information" />
      <campaignForm.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Campaign name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputField className="grow" label="Campaign name" field={field} />
        )}
      </campaignForm.Field>
      <campaignForm.Field
        name="location"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Campaign location name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputField label="Campaign location (city name)" field={field} />
        )}
      </campaignForm.Field>
      <PictureField
        form={campaignForm}
        sizeInfo={{
          aspectRatio: '10/3',
          maxHeight: '',
          minHeight: '',
        }}
      />
      <Divider />
      <ArrowHeader2 title="Campaign Factions" />
      <campaignForm.Field name="factions" mode="array">
        {(field) => (
          <div className="flex w-full flex-col gap-4 lg:gap-8">
            {field.state.value.map((_, i: number) => {
              return (
                <div className="flex w-full flex-col gap-4" key={i}>
                  <campaignForm.Field
                    name={`factions[${i}].factionType`}
                    validators={{
                      onSubmit: ({ value }) =>
                        !value ? 'Select a faction type' : undefined,
                    }}
                  >
                    {(subfield) => (
                      <InputSelectField
                        className="w-full"
                        label="Faction type"
                        field={subfield}
                        options={[
                          'churchOfElShaddai',
                          'corporateHoldouts',
                          'federalReservists',
                          'noblebloods',
                        ]}
                      />
                    )}
                  </campaignForm.Field>
                  <campaignForm.Field
                    name={`factions[${i}].name`}
                    validators={{
                      onSubmit: ({ value }) =>
                        !value
                          ? 'Create a unique name for this faction'
                          : undefined,
                    }}
                  >
                    {(subfield) => (
                      <InputField field={subfield} label="Faction name" />
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
          <Divider />
          <ArrowHeader2 title="Starting Faction Affiliation" />
          <campaignForm.Field name="affiliation">
            {(field) => <AffiliationBar field={field} />}
          </campaignForm.Field>

          <div className="flex flex-col gap-8">
            <Divider />
            <ArrowHeader2 title="Session 0 Briefing" />
            <campaignForm.Field
              name="briefing"
              validators={{
                onChange: ({ value }) =>
                  value.html.length < 20
                    ? 'Section content has not met the minimum length requirement'
                    : undefined,
              }}
            >
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
      <div className="flex flex-col gap-8">
        <Divider />
        <ArrowHeader2 title="Invite Players" />
        <InputFieldBasic
          label="Search users"
          onChange={(value: string) => {
            setNameQuery(value);
          }}
        />
        <campaignForm.Subscribe
          selector={(state) => [
            state.values.players,
            state.values.pendingPlayers,
          ]}
        >
          {([players, pendingPlayers]) => {
            if ([...players, ...pendingPlayers].length > 0) {
              return <ArrowHeader2 title="Selected Players" />;
            }
            return null;
          }}
        </campaignForm.Subscribe>
        <div className="flex flex-col gap-4">
          <campaignForm.Field name="players">
            {(field) => {
              const playerArray = field.state.value;

              return (
                <>
                  {playerArray.map((user: User) => (
                    <div className="flex items-center gap-4" key={user.id}>
                      <ItemCardSmall
                        heading={
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-8">
                              <AccountPicture
                                className="opacity-50"
                                user={user}
                              />
                              <h3>{user.username}</h3>
                            </div>
                          </div>
                        }
                      />
                      <input
                        className="size-8"
                        type="checkbox"
                        checked={true}
                        onChange={() => {
                          field.handleChange((prev: User[]) => {
                            if (
                              prev.some((player: User) => player.id === user.id)
                            ) {
                              return prev.filter(
                                (player: User) => player.id !== user.id,
                              );
                            } else {
                              return [...prev, user];
                            }
                          });
                        }}
                      />
                    </div>
                  ))}
                </>
              );
            }}
          </campaignForm.Field>
          <campaignForm.Field name="pendingPlayers">
            {(field) => {
              const playerArray = field.state.value;

              return (
                <>
                  {playerArray.map((user: User) => (
                    <div className="flex items-center gap-4" key={user.id}>
                      <ItemCardSmall
                        heading={
                          <div className="flex w-full items-center justify-between">
                            <div className="flex items-center gap-8">
                              <AccountPicture
                                className="opacity-50"
                                user={user}
                              />
                              <h3>{user.username}</h3>
                              <p className="text-tertiary">(Pending)</p>
                            </div>
                          </div>
                        }
                      />
                      <input
                        className="size-8"
                        type="checkbox"
                        checked={true}
                        onChange={() => {
                          field.handleChange((prev: User[]) => {
                            if (
                              prev.some((player: User) => player.id === user.id)
                            ) {
                              return prev.filter(
                                (player: User) => player.id !== user.id,
                              );
                            } else {
                              return [...prev, user];
                            }
                          });
                        }}
                      />
                    </div>
                  ))}
                  {field.state.value.length > 0 && <Divider />}
                  {usersLoading || usersPending ? (
                    <Loading />
                  ) : (
                    users?.map((user: User) => {
                      const status = playerArray.some(
                        (player: User) => player.id === user.id,
                      );
                      return (
                        <div className="flex items-center gap-4" key={user.id}>
                          <ItemCardSmall
                            heading={
                              <div className="flex w-full items-center justify-between">
                                <div className="flex items-center gap-8">
                                  <AccountPicture
                                    className="opacity-50"
                                    user={user}
                                  />
                                  <h3>{user.username}</h3>
                                </div>
                              </div>
                            }
                          />
                          <input
                            className="size-8"
                            type="checkbox"
                            checked={status}
                            onChange={() => {
                              field.handleChange((prev: User[]) => {
                                if (
                                  prev.some(
                                    (player: User) => player.id === user.id,
                                  )
                                ) {
                                  return prev.filter(
                                    (player: User) => player.id !== user.id,
                                  );
                                } else {
                                  return [...prev, user];
                                }
                              });
                            }}
                          />
                        </div>
                      );
                    })
                  )}
                </>
              );
            }}
          </campaignForm.Field>
        </div>
      </div>
    </FormLayout>
  );
};

export default CampaignForm;
