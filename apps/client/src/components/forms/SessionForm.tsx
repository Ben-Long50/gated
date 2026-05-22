import InputField from '../formFields/InputField';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import useCreateSessionMutation from '../../hooks/useCreateSessionMutation/useCreateSessionMutation';
import useSessionQuery from '../../hooks/useSessionQuery/useSessionQuery';
import PictureField from '../formFields/PictureField';
import useSessionForm from 'src/hooks/form hooks/useSessionForm';
import BtnAuth from '../buttons/BtnAuth';
import CharacterCardXSmall from '../CharacterCardXSmall';

const SessionForm = () => {
  const { campaignId, sessionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const createSession = useCreateSessionMutation(
    Number(campaignId),
    Number(sessionId),
  );

  const { data: session, isLoading } = useSessionQuery(
    Number(campaignId),
    Number(sessionId),
  );

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
      <sessionForm.Field name="name">
        {(field) => (
          <InputField
            label="Session Name"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </sessionForm.Field>
      <sessionForm.Field name="location">
        {(field) => (
          <InputField
            label="Session Location"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
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
        <ArrowHeader2 title="Session Characters" />
        <sessionForm.Subscribe selector={(state) => state.values.characterIds}>
          {(characterIds) =>
            characterIds.map((characterId) => (
              <CharacterCardXSmall
                characterId={characterId}
                characterList={true}
                active={false}
              />
            ))
          }
        </sessionForm.Subscribe>
        <BtnAuth onClick={() => navigate('sessionCharacters')}>
          Select Session Characters
        </BtnAuth>
        {parts.includes('sessionCharacters') && (
          <Outlet context={{ form: sessionForm }} />
        )}
      </div>
      <Divider />
      <div className="flex flex-col gap-8">
        <ArrowHeader2 title="Session Briefing" />
        <sessionForm.Field name="briefing">
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
