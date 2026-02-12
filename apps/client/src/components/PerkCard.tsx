import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { Perk } from 'src/types/perk';
import ItemCardSmall from './ItemCardSmall';
import ArrowHeader4 from './ArrowHeader4';
import ThemeContainer from './ThemeContainer';
import { capitalCase } from 'change-case';
import { FieldApi } from '@tanstack/react-form';
import AttributeListSmall from './AttributeListSmall';
import AttributeList from './AttributeList';

const PerkCard = ({
  perk,
  mode,
  expanded,
  perkIds,
  field,
}: {
  perk: Perk;
  mode?: string;
  expanded?: boolean;
  perkIds?: number[];
  field?: FieldApi;
}) => {
  const { user } = useContext(AuthContext);

  const attributes = Object.entries(perk.attributes)
    .map(([attribute, { points }]) => [attribute, points])
    .filter(([_, points]) => points > 0);

  const skills = Object.values(perk.attributes).flatMap(({ skills }) =>
    Object.entries(skills)
      .map(([skill, points]) => [skill, points.points])
      .filter(([_, points]) => points > 0),
  );

  return (
    <div className="flex items-center gap-4">
      <ItemCardSmall
        expanded={expanded}
        heading={
          <div className="flex w-full items-center justify-between gap-4 pr-3">
            <h3>{perk.name}</h3>
            <AttributeListSmall attributeTree={perk.attributes} />
            {mode === 'codex' &&
              ((mode === 'codex' && user?.role === 'ADMIN') ||
                (mode === 'codex' && user?.role === 'SUPERADMIN')) && (
                <Link to={`/glam/codex/perks/${perk.id}/update`}>
                  <button className="text-accent hover:underline">Edit</button>
                </Link>
              )}
          </div>
        }
      >
        {attributes.length === 0 && skills.length === 0 ? (
          <ArrowHeader4 title="No skill requirements" />
        ) : (
          <AttributeList attributeTree={perk.attributes} />
        )}
        <p className="text-secondary">{perk.description}</p>
        {perk.modifiers && (
          <div className="flex flex-col gap-4">
            {Object.entries(perk.modifiers).map(([stat, value], index) => (
              <ThemeContainer
                key={index}
                borderColor="transparent"
                chamfer="small"
              >
                <div className="bg-tertiary flex w-full items-center justify-between p-3 px-4 clip-4">
                  <h4>{capitalCase(stat)}</h4>
                  <p
                    className={`${index !== 0 && 'ml-1'} ${value > 0 || typeof value === 'string' ? 'text-accent' : 'text-error'} mr-1 inline-block font-semibold`}
                  >
                    {typeof value === 'number' ? value : capitalCase(value)}
                  </p>
                </div>
              </ThemeContainer>
            ))}
          </div>
        )}
      </ItemCardSmall>
      {mode === 'form' && (
        <input
          className="size-6"
          type="checkbox"
          checked={perkIds?.includes(perk.id)}
          onChange={() => {
            if (!perkIds?.includes(perk.id)) {
              field.handleChange([...field.state.value, perk]);
            } else {
              field.handleChange(
                field.state.value.filter((item: Perk) => item.id !== perk.id),
              );
            }
          }}
        />
      )}
    </div>
  );
};

export default PerkCard;
