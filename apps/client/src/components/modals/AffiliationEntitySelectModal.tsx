import { useNavigate, useOutletContext, useParams } from 'react-router-dom';
import useCampaignQuery from 'src/hooks/useCampaignQuery/useCampaignQuery';
import { Character } from '@gated/shared';
import { useState } from 'react';
import BtnRect from '../buttons/BtnRect';
import BtnAuth from '../buttons/BtnAuth';
import Divider from '../Divider';
import { capitalCase } from 'change-case';
import EntityCard from '../EntityCard';
import useFactionQueries from 'src/hooks/faction hooks/useFactionQueries';
import useGangQueries from 'src/hooks/gang hooks/useGangQueries/useGangQueries';
import Loading from '../Loading';
import { Faction } from '@gated/shared';
import { Gang } from '@gated/shared';
import InputFieldCheckbox from '../formFields/InputFieldCheckbox';
import useCharacterQueries from 'src/hooks/character hooks/useUpdateCharacterLevelMutation/useCharactersQuery/useCharacterQueries';

const AffiliationEntitySelectModal = () => {
  const { campaignId, gangId } = useParams();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'faction' | 'gang' | 'character'>('faction');

  const { form } = useOutletContext();

  const { data: campaign } = useCampaignQuery(Number(campaignId));

  const { factions, isLoading: factionsLoading } = useFactionQueries(
    campaign?.factions.map((faction) => faction.id) || [],
  );

  const { gangs, isLoading: gangsLoading } = useGangQueries(
    campaign?.gangs.map((gang) => gang.id) || [],
  );

  const { characters, isLoading: charactersLoading } = useCharacterQueries(
    campaign?.characters.map((character) => character.id) || [],
  );

  if (factionsLoading || gangsLoading || charactersLoading) return <Loading />;

  return (
    <>
      <h1>Select {capitalCase(tab)}s</h1>
      <Divider />
      <div className="grid w-full grid-cols-3 items-center gap-4">
        <BtnAuth active={tab === 'faction'} onClick={() => setTab('faction')}>
          Factions
        </BtnAuth>
        <BtnAuth active={tab === 'gang'} onClick={() => setTab('gang')}>
          Gangs
        </BtnAuth>
        <BtnAuth
          active={tab === 'character'}
          onClick={() => setTab('character')}
        >
          Characters
        </BtnAuth>
      </div>
      <div className="flex w-full flex-col items-center gap-4 overflow-y-auto">
        {tab === 'faction' &&
          factions
            .filter((faction: Faction) => faction != null)
            .map((faction: Faction) => (
              <div
                className="flex w-full items-center justify-between gap-8"
                key={faction.id}
              >
                <EntityCard entity={faction} />
                <form.Field name="factionIds">
                  {(field) => {
                    const checked = field.state.value.some(
                      (id: number) => faction.id === Number(id),
                    );

                    return (
                      <InputFieldCheckbox
                        value={faction.id}
                        checked={checked}
                        onChange={(value) => {
                          field.handleChange((prev: number[]) =>
                            checked
                              ? prev.filter(
                                  (id: number) => Number(value) !== id,
                                )
                              : [...prev, Number(value)],
                          );
                        }}
                      />
                    );
                  }}
                </form.Field>
              </div>
            ))}
        {tab === 'gang' &&
          gangs
            .filter((gang: Gang) => gang != null)
            .map((gang: Gang) => (
              <div
                className="flex w-full items-center justify-between gap-8"
                key={gang.id}
              >
                <EntityCard entity={gang} />
                <form.Field name="gangIds">
                  {(field) => {
                    const checked = field.state.value.some(
                      (id: number) => gang.id === Number(id),
                    );

                    return (
                      <InputFieldCheckbox
                        value={gang.id}
                        checked={checked}
                        onChange={(value) => {
                          field.handleChange((prev: number[]) =>
                            checked
                              ? prev.filter(
                                  (id: number) => Number(value) !== id,
                                )
                              : [...prev, Number(value)],
                          );
                        }}
                      />
                    );
                  }}
                </form.Field>
              </div>
            ))}
        {tab === 'character' &&
          characters
            .filter((character) => character != null)
            .map((character: Character) => (
              <div
                className="flex w-full items-center justify-between gap-8"
                key={character.id}
              >
                <EntityCard entity={character} />
                <form.Field name="characterIds">
                  {(field) => {
                    const checked = field.state.value.some(
                      (id: number) => character.id === Number(id),
                    );

                    return (
                      <InputFieldCheckbox
                        value={character.id}
                        checked={checked}
                        onChange={(value) => {
                          field.handleChange((prev: number[]) =>
                            checked
                              ? prev.filter(
                                  (id: number) => Number(value) !== id,
                                )
                              : [...prev, Number(value)],
                          );
                        }}
                      />
                    );
                  }}
                </form.Field>
              </div>
            ))}
      </div>
      <div className="flex flex-col gap-8">
        <form.Subscribe
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
        </form.Subscribe>
        <BtnRect
          ariaLabel="Select entities"
          onClick={gangId ? () => form.handleSubmit() : () => navigate('..')}
        >
          Confirm Selection
        </BtnRect>
      </div>
    </>
  );
};

export default AffiliationEntitySelectModal;
