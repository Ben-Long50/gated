import { Affiliation } from '@gated/shared';
import { Fragment, useContext } from 'react';
import AffiliationBar from './AffiliationBar';
import AffiliationIcon from './icons/AffiliationIcon';
import { LayoutContext } from '../contexts/LayoutContext';
import CharacterPictureRound from './characterComponents/CharacterPictureRound';
import ArrowHeader4 from './ArrowHeader4';
import useAffiliationValueMutation from 'src/hooks/useAffiliationValueMutation/useAffiliationValueMutation';
import { AuthContext } from 'src/contexts/AuthContext';

const AffiliationCard = ({ affiliation }: { affiliation: Affiliation }) => {
  const { user } = useContext(AuthContext);
  const { mobile } = useContext(LayoutContext);

  const editAffiliationValue = useAffiliationValueMutation(affiliation.id);

  const entities = [
    ...affiliation.factions,
    ...affiliation.gangs,
    ...affiliation.characters,
  ];

  return (
    <div className="flex w-full flex-col items-start gap-4">
      <div className="grid w-full grid-cols-[1fr_auto_1fr] gap-8">
        {entities.map((entity, index) => {
          return (
            <Fragment key={index}>
              <div
                className={`${index === 0 ? 'mr-auto justify-start' : 'ml-auto justify-end'} flex w-3/4 items-center gap-4`}
              >
                {index === 0 && <CharacterPictureRound character={entity} />}
                {!mobile && (
                  <ArrowHeader4
                    className={`${index === 0 ? 'text-left' : 'text-right'} text-primary`}
                    title={entity.name}
                    reverse={index === 0 ? false : true}
                  />
                )}
                {index > 0 && <CharacterPictureRound character={entity} />}
              </div>
              {index === 0 && (
                <AffiliationIcon
                  className={`${mobile ? 'size-10' : 'size-12'} text-tertiary place-self-center`}
                />
              )}
            </Fragment>
          );
        })}
      </div>
      <AffiliationBar
        className={`${!mobile && 'px-4'}`}
        value={affiliation.value}
        onClick={
          user.id === affiliation.campaign.ownerId ||
          affiliation.characters.some(
            (character) => character.userId === user.id,
          )
            ? (value: number) => editAffiliationValue.mutate(value)
            : undefined
        }
      />
    </div>
  );
};

export default AffiliationCard;
