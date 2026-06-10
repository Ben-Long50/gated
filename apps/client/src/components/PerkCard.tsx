import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ItemCardSmall from './ItemCardSmall';
import ArrowHeader4 from './ArrowHeader4';
import ThemeContainer from './ThemeContainer';
import { capitalCase } from 'change-case';
import AttributeListSmall from './AttributeListSmall';
import AttributeList from './AttributeList';
import usePerkQuery from 'src/hooks/usePerkQuery/usePerkQuery';

const PerkCard = ({
  perkId,
  expanded,
}: {
  perkId: number;
  expanded?: boolean;
}) => {
  const { user } = useContext(AuthContext);

  const { data: perk } = usePerkQuery(perkId);

  const attributes = perk?.attributes
    ? Object.entries(perk?.attributes)
        .map(([attribute, { points }]) => [attribute, points])
        .filter(([_, points]) => points > 0)
    : [];

  const skills = perk?.attributes
    ? Object.values(perk.attributes).flatMap(({ skills }) =>
        Object.entries(skills)
          .map(([skill, points]) => [skill, points.points])
          .filter(([_, points]) => points > 0),
      )
    : [];

  return (
    <div className="flex items-center gap-4">
      <ItemCardSmall
        expanded={expanded}
        heading={
          <div className="flex w-full items-center justify-between gap-4 pr-3">
            <h3>{perk?.name}</h3>
            {perk?.attributes && (
              <AttributeListSmall attributeTree={perk?.attributes} />
            )}
            {(user?.role === 'ADMIN' || user?.role === 'SUPERADMIN') && (
              <Link to={`/glam/codex/perks/${perk?.id}/update`}>
                <button className="text-accent hover:underline">Edit</button>
              </Link>
            )}
          </div>
        }
      >
        {attributes.length === 0 && skills.length === 0 ? (
          <ArrowHeader4
            className="text-primary"
            title="No skill requirements"
          />
        ) : (
          perk?.attributes && <AttributeList attributeTree={perk?.attributes} />
        )}
        <p className="text-secondary">{perk?.description}</p>
        {perk?.modifiers && (
          <div className="flex flex-col gap-4">
            {Object.entries(perk?.modifiers).map(([stat, value], index) => (
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
    </div>
  );
};

export default PerkCard;
