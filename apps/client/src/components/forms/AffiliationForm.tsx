import { useForm } from '@tanstack/react-form';
import { useContext } from 'react';
import BtnRect from '../buttons/BtnRect';
import Loading from '../Loading';
import FormLayout from '../../layouts/FormLayout';
import { Link, useParams } from 'react-router-dom';
import AffiliationBar from '../AffiliationBar';
import { Faction } from 'src/types/faction';
import useCreateAffiliationMutation from '../../hooks/useCreateAffiliationMutation/useCreateAffiliationMutation';
import InputSelectField from '../InputSelectField';
import AffiliationIcon from '../icons/AffiliationIcon';
import { LayoutContext } from '../../contexts/LayoutContext';
import useAffiliationQuery from '../../hooks/useAffiliationQuery/useAffiliationQuery';
import useDeleteAffiliationMutation from '../../hooks/useDeleteAffiliationMutation/useDeleteAffiliationMutation';
import ArrowHeader4 from '../ArrowHeader4';
import CharacterPictureRound from '../CharacterPictureRound';
import useAffiliationForm from 'src/hooks/form hooks/useAffiliationForm';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import useGangQueries from 'src/hooks/gang hooks/useGangQueries/useGangQueries';
import useCharacterQueries from 'src/hooks/useCharactersQuery/useCharacterQueries';
import useFactionQueries from 'src/hooks/faction hooks/useFactionQueries';
import { Gang } from 'src/types/gang';
import { Character } from 'src/types/character';

const AffiliationForm = () => {
  const { mobile } = useContext(LayoutContext);
  const { campaignId, factionId, gangId, characterId, affiliationId } =
    useParams();

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
      <div className="flex w-full flex-col gap-4">
        <affiliationForm.Field name="factionIds">
          {(field) => (
            <InputSelectField
              field={field}
              label="Factions"
              options={factions.filter(
                (faction: Faction) => faction.id !== Number(factionId),
              )}
              onChange={(e) => field.pushValue(e.target.value.id)}
            />
          )}
        </affiliationForm.Field>
        <affiliationForm.Field name="gangIds">
          {(field) => (
            <InputSelectField
              field={field}
              label="Gangs"
              options={gangs.filter((gang: Gang) => gang.id !== Number(gangId))}
              onChange={(e) => field.pushValue(e.target.value.id)}
            />
          )}
        </affiliationForm.Field>
        <affiliationForm.Field name="characterIds">
          {(field) => (
            <InputSelectField
              field={field}
              label="Characters"
              options={characters.filter(
                (character: Character) => character.id !== Number(characterId),
              )}
              onChange={(e) => field.pushValue(e.target.value.id)}
            />
          )}
        </affiliationForm.Field>
      </div>

      {/* <div
        className={`${mobile ? 'grid-rows-[auto_auto_auto] place-items-center' : 'grid-cols-[1fr_auto_1fr] gap-8'} grid items-center`}
      >
        {characterId && (
          <div className={`flex items-center gap-4 justify-self-start`}>
            <CharacterPictureRound character={character} />
            <ArrowHeader4
              title={character?.firstName + ' ' + character?.lastName}
            />
          </div>
        )}
        {factionId && (
          <div className={`flex items-center gap-4 justify-self-start`}>
            <CharacterPictureRound character={faction} />
            <ArrowHeader4 className="text-primary" title={faction.name} />
          </div>
        )}
        <AffiliationIcon
          className={`${mobile ? 'size-10' : 'size-12'} text-tertiary`}
        />
      </div> */}
      <div>
        <affiliationForm.Field name="value">
          {(field) => <AffiliationBar field={field} />}
        </affiliationForm.Field>
      </div>
    </FormLayout>
  );
};

export default AffiliationForm;
