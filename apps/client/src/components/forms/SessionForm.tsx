import InputField from '../InputField';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import useCreateSessionMutation from '../../hooks/useCreateSessionMutation/useCreateSessionMutation';
import useCampaignQuery from '../../hooks/useCampaignQuery/useCampaignQuery';
import useSessionQuery from '../../hooks/useSessionQuery/useSessionQuery';
import PictureField from '../formFields/PictureField';
import useSessionForm from 'src/hooks/form hooks/useSessionForm';
import CharacterCardXSmall from '../CharacterCardXSmall';
import useCharacters from 'src/hooks/useCharacters';

const SessionForm = () => {
  const { campaignId, sessionId } = useParams();

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const { characters, isLoading: charactersLoading } = useCharacters(
    campaign ? campaign?.characters.map((character) => character.id) : [],
  );

  const createSession = useCreateSessionMutation(
    Number(campaignId),
    Number(sessionId),
  );

  const { data: session, isLoading: sessionLoading } = useSessionQuery(
    Number(campaignId),
    Number(sessionId),
  );

  const isLoading = campaignLoading || sessionLoading || charactersLoading;

  const sessionForm = useSessionForm(createSession, session);

  if (isLoading) return <Loading />;

  return (
    <FormLayout
      label="Session"
      form={sessionForm}
      itemId={sessionId}
      createMutation={createSession}
    >
      <ArrowHeader2 title="Session Information" />
      <sessionForm.Field
        name="name"
        validators={{
          onChange: ({ value }) =>
            value.length < 2
              ? 'Session name must be at least 2 characters long'
              : undefined,
        }}
      >
        {(field) => (
          <InputField className="grow" label="Session Name" field={field} />
        )}
      </sessionForm.Field>
      <sessionForm.Field name="location">
        {(field) => <InputField label="Session Location" field={field} />}
      </sessionForm.Field>
      <PictureField
        form={sessionForm}
        sizeInfo={{
          aspectRatio: '10/3',
          maxHeight: '500px',
          minHeight: '300px',
        }}
      />
      <Divider />
      <div className="flex flex-col gap-8">
        <ArrowHeader2 title="Add Session Characters" />
        <sessionForm.Field
          mode="array"
          name="characterIds"
          validators={{
            onChange: ({ value }) =>
              value.length < 1
                ? 'You must invite at least 2 player characters to create a session'
                : undefined,
          }}
        >
          {(field) => {
            return (
              <div className="flex w-full flex-col gap-4">
                {characters?.map(
                  (character) =>
                    character && (
                      <div className="flex w-full items-center justify-between gap-8">
                        <CharacterCardXSmall
                          characterList={true}
                          active={false}
                          menu={false}
                          characterId={character.id}
                        />
                        <input
                          type="checkbox"
                          className="size-7"
                          checked={field.state.value.includes(character.id)}
                          onChange={() => {
                            if (field.state.value.includes(character.id)) {
                              field.handleChange(
                                field.state.value.filter(
                                  (id) => id !== character.id,
                                ),
                              );
                            } else {
                              field.handleChange([
                                ...field.state.value,
                                character.id,
                              ]);
                            }
                          }}
                        />
                      </div>
                    ),
                )}
              </div>
            );
          }}
        </sessionForm.Field>
      </div>
      <Divider />
      <div className="flex flex-col gap-8">
        <ArrowHeader2 title="Session Briefing" />
        <sessionForm.Field
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
        </sessionForm.Field>
      </div>
    </FormLayout>
  );
};

export default SessionForm;
