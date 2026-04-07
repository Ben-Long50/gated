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
import ArrowHeader3 from './ArrowHeader3';

const GangForm = () => {
  const { accentPrimary } = useContext(ThemeContext);
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();

  const { data: campaign, isLoading: campaignLoading } = useCampaignQuery(
    Number(campaignId),
  );

  const createGang = useCreateGangMutation(Number(campaignId), Number(gangId));

  const { data: gang, isLoading: gangLoading } = useGangQuery(Number(gangId));

  const gangForm = useForm({
    defaultValues: {
      id: gangId || null,
      name: gang?.name || '',
      gangPoints: gang?.gangPoints || null,
      reputation: gang?.reputation || null,
      profits: gang?.profits || null,
      picture: gang?.picture || '',
      background: {} as { html: string; nodes: string },
      campaignId: gang?.campaignId || Number(campaignId),
      factionId: gang?.factionId || null,
      publicId: gang?.picture?.publicId || '',
      position: gang?.picture?.position || { x: 50, y: 50 },
      leaderIds:
        gang?.leaders.map((character) => character.id) || ([] as number[]),
      characterIds:
        gang?.characters.map((character) => character.id) || ([] as number[]),
    },

    onSubmit: async ({ value }) => {
      const data = {
        name: value.name,
        picture: value.picture,
        campaignId: value.campaignId,
        ...(value.gangPoints != null && { gangPoints: value.gangPoints }),
        ...(value.reputation != null && { reputation: value.reputation }),
        ...(value.profits != null && { profits: value.profits }),
        ...(value.factionId != null && {
          factionId: value.factionId.id,
        }),
        leaderIds: value.leaderIds,
        characterIds: value.characterIds,
      };

      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
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
        <Divider />
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
        <Divider />
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
        <Divider />
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
              <gangForm.Subscribe
                selector={(state) => state.values.characterIds}
              >
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
          <BtnRect
            ariaLabel="Open character select window"
            onClick={() => navigate('characterSelect')}
          >
            Select Gang Characters
          </BtnRect>
        </div>
        <Divider />
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
