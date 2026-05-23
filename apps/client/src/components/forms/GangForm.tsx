import BtnRect from '../buttons/BtnRect';
import InputField from '../formFields/InputField';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import LexicalEditor from '../lexical/LexicalEditor';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';
import PictureField from '../formFields/PictureField';
import InputSelectField from '../formFields/InputSelectField';
import useCreateGangMutation from 'src/hooks/gang hooks/useCreateGangMutation/useCreateGangMutation';
import useGangQuery from 'src/hooks/gang hooks/useGangQuery/useGangQuery';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardSmall from '../characterComponents/CharacterCardSmall';
import ArrowHeader3 from '../ArrowHeader3';
import useGangForm from 'src/hooks/form hooks/useGangForm';
import BtnAuth from '../buttons/BtnAuth';

const GangForm = () => {
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const parts = location.pathname.split('/');

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const createGang = useCreateGangMutation(Number(campaignId), Number(gangId));

  const { data: gang, isLoading: gangLoading } = useGangQuery(Number(gangId));

  const gangForm = useGangForm(createGang, gang);

  if (campaignLoading || gangLoading) return <Loading />;

  return (
    <FormLayout label="Gang" form={gangForm} createMutation={createGang}>
      <ArrowHeader2 title="Gang Information" />
      <gangForm.Field name="name">
        {(field) => (
          <InputField
            label="Gang Name"
            value={field.state.value}
            onChange={(value) => field.handleChange(value)}
          />
        )}
      </gangForm.Field>
      <PictureField
        form={gangForm}
        sizeInfo={{
          aspectRatio: '10/3',
          maxHeight: '',
          minHeight: '',
        }}
      />
      <Divider />
      <div className="flex flex-col gap-4">
        <ArrowHeader2 title="Faction Affiliation" />
        <gangForm.Field name="factionId" mode="array">
          {(field) => (
            <InputSelectField
              label="Factions"
              options={campaign?.factions || []}
              value={field.state.value}
              onChange={(value) => field.handleChange(value.id)}
            />
          )}
        </gangForm.Field>
      </div>
      <Divider />
      <div className="flex flex-col gap-4">
        <ArrowHeader2 title="Gang Background" />
        <gangForm.Field name="background">
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
        </gangForm.Field>
      </div>
      <Divider />
      <div className="flex flex-col gap-8">
        <ArrowHeader2 title="Gang Characters" />
        <div className="bg-secondary shadow-color rounded-md p-4 shadow-md">
          <ArrowHeader3 title="Leaders" />
          <Divider />
          <div className="flex w-full flex-col gap-4 sm:gap-8">
            <gangForm.Subscribe selector={(state) => state.values.leaderIds}>
              {(leaders) =>
                leaders.length > 0 ? (
                  leaders.map((id: number) => (
                    <CharacterCardSmall
                      characterList={true}
                      characterId={id}
                      expanding={false}
                      active={false}
                    />
                  ))
                ) : (
                  <h4>N/A</h4>
                )
              }
            </gangForm.Subscribe>
          </div>
        </div>
        <div className="bg-secondary shadow-color rounded-md p-4 shadow-md">
          <ArrowHeader3 title="Members" />
          <Divider />
          <div className="flex w-full flex-col gap-4 sm:gap-8">
            <gangForm.Subscribe selector={(state) => state.values.characterIds}>
              {(characters) =>
                characters.length > 0 ? (
                  characters.map((id: number) => (
                    <CharacterCardSmall
                      characterList={true}
                      characterId={id}
                      expanding={false}
                      active={false}
                    />
                  ))
                ) : (
                  <h4>N/A</h4>
                )
              }
            </gangForm.Subscribe>
          </div>
        </div>
        <BtnAuth onClick={() => navigate('characterSelect')}>
          Select Gang Characters
        </BtnAuth>
      </div>
      <Outlet context={{ form: gangForm, parts }} />
    </FormLayout>
  );
};

export default GangForm;
