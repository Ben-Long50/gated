import { useForm, useStore } from '@tanstack/react-form';
import { useContext, useState } from 'react';
import BtnRect from './buttons/BtnRect';
import InputField from './InputField';
import Loading from './Loading';
import FormLayout from '../layouts/FormLayout';
import { Outlet, useNavigate, useParams } from 'react-router-dom';
import LexicalEditor from './lexical/LexicalEditor';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import PictureField from './formFields/PictureField';
import InputSelectField from './InputSelectField';
import useCreateGangMutation from 'src/hooks/gang hooks/useCreateGangMutation/useCreateGangMutation';
import useGangQuery from 'src/hooks/gang hooks/useGangQuery/useGangQuery';
import { Character } from 'src/types/character';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import CharacterCardSmall from './CharacterCardSmall';
import { ThemeContext } from 'src/contexts/ThemeContext';
import ThemeContainer from './ThemeContainer';

const GangForm = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId, gangId } = useParams();
  const [formMessage, setFormMessage] = useState('');
  const [deleteMode, setDeleteMode] = useState(false);
  const navigate = useNavigate();

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const createGang = useCreateGangMutation(
    Number(campaignId),
    setFormMessage,
    Number(gangId),
  );

  const { data: gang, isLoading: gangLoading } = useGangQuery(Number(gangId));

  const handleReset = async () => {
    gangForm.reset();
  };

  const handleDelete = () => {
    return;
  };

  const gangForm = useForm({
    defaultValues: {
      id: gangId || null,
      name: gang?.name || '',
      gangPoints: gang?.gangPoints || null,
      profits: gang?.profits || null,
      picture: gang?.picture || '',
      background: {} as { html: string; nodes: string },
      campaignId: gang?.campaignId || Number(campaignId),
      factionId: gang?.factionId || null,
      publicId: gang?.picture?.publicId || '',
      position: gang?.picture?.position || { x: 50, y: 50 },
      characters: gang?.characters || ([] as Character[]),
    },

    onSubmit: async ({ value }) => {
      if (value.factionId) {
        value.factionId = value.factionId.id;
      }

      value.characters = value.characters.map((character: Character) => ({
        id: character.id,
      }));

      console.log(value);

      const formData = new FormData();

      Object.entries(value).forEach(([key, value]) => {
        if (key === 'picture' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, JSON.stringify(value));
        }
      });
      await createGang.mutate(formData);
    },
  });

  const formErrorMap = useStore(gangForm.store, (state) => state.errorMap);

  if (campaignLoading || gangLoading) return <Loading />;

  return (
    <ThemeContainer
      className="mb-auto w-full max-w-5xl"
      chamfer="large"
      borderColor={accentPrimary}
    >
      <form
        className="flex flex-col gap-8 p-8"
        onSubmit={(e) => {
          e.preventDefault();
          e.stopPropagation();
          if (!createGang.isPending) {
            gangForm.handleSubmit();
          }
        }}
      >
        <div className="flex items-center justify-center gap-4">
          <h1>{gangId ? `Update ${gang?.name}` : 'Create Gang'}</h1>
        </div>
        <Divider className="opacity-50" />
        <ArrowHeader2 title="Gang Information" />
        <gangForm.Field
          name="name"
          validators={{
            onChange: ({ value }) =>
              value.length < 2
                ? 'Gang name must be at least 2 characters long'
                : undefined,
          }}
        >
          {(field) => (
            <InputField className="grow" label="Gang Name" field={field} />
          )}
        </gangForm.Field>
        {gangId && (
          <gangForm.Field
            name="gangPoints"
            validators={{
              onChange: ({ value }) =>
                value < 0 ? 'Gang Points cannot be set below 0' : undefined,
            }}
          >
            {(field) => (
              <InputField type="number" label="Gang Points" field={field} />
            )}
          </gangForm.Field>
        )}
        <PictureField
          form={gangForm}
          sizeInfo={{
            aspectRatio: '10/3',
            maxHeight: '',
            minHeight: '',
          }}
        />
        <Divider className="opacity-50" />
        <div className="flex flex-col gap-4">
          <ArrowHeader2 title="Faction Affiliation" />
          <gangForm.Field name="factionId" mode="array">
            {(field) => (
              <InputSelectField
                className="w-full"
                label="Factions"
                field={field}
                options={campaign?.factions || []}
                onChange={(faction) => field.handleChange(faction)}
              />
            )}
          </gangForm.Field>
        </div>
        <Divider className="opacity-50" />
        <div className="flex flex-col gap-4">
          <ArrowHeader2 title="Gang Background" />
          <gangForm.Field
            name="background"
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
          </gangForm.Field>
        </div>
        <Divider className="opacity-50" />
        <div className="flex flex-col gap-4">
          <ArrowHeader2 title="Gang Characters" />
          <gangForm.Subscribe selector={(state) => state.values.characters}>
            {(characters) =>
              characters.map((character: Character) => (
                <CharacterCardSmall
                  characterList={true}
                  characterId={character.id}
                  expanding={false}
                  active={false}
                />
              ))
            }
          </gangForm.Subscribe>
          <BtnRect
            ariaLabel="Open character select window"
            onClick={() => navigate('characterSelect')}
          >
            Select Gang Characters
          </BtnRect>
        </div>
        <Divider className="opacity-50" />
        {formErrorMap.onSubmit && (
          <div>
            <em className="text-error">{formErrorMap.onSubmit}</em>
          </div>
        )}
        <BtnRect
          ariaLabel={gangId ? `Update ${gang.name}` : 'Create Gang'}
          type="submit"
          className="group w-full"
        >
          {createGang.isPending ? (
            <Loading
              className="group-hover:text-accent dark:text-gray-900"
              size={1.15}
            />
          ) : gangId ? (
            `Update ${gang.name}`
          ) : (
            'Create Gang'
          )}
        </BtnRect>
      </form>
      <Outlet context={{ form: gangForm }} />
    </ThemeContainer>
  );
};

export default GangForm;
