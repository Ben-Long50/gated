import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import ItemCardSmall from './ItemCardSmall';
import ArrowHeader4 from './ArrowHeader4';
import AttributeListSmall from './AttributeListSmall';
import AttributeList from './AttributeList';
import usePerkQuery from 'src/hooks/usePerkQuery/usePerkQuery';
import ActionCard from './ActionCard';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';

const PerkCard = ({
  perkId,
  expanded = false,
  child = false,
}: {
  perkId: number;
  expanded?: boolean;
  child?: boolean;
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
    <div className="flex w-full items-center gap-4">
      <ItemCardSmall
        child={child}
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
        {perk?.actions && perk.actions.length > 0 && (
          <>
            <Divider />
            <ArrowHeader3 title="Actions" />
            {perk.actions.map((action) => (
              <ActionCard actionId={action.id} size="large" child={true} />
            ))}
          </>
        )}
      </ItemCardSmall>
    </div>
  );
};

export default PerkCard;
