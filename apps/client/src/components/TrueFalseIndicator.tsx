import { mdiCheckCircleOutline, mdiCircleOutline } from '@mdi/js';
import Icon from '@mdi/react';

const TrueFalseIndicator = ({
  label,
  active,
}: {
  label: string;
  active: boolean;
}) => {
  return (
    <div className="flex items-center justify-between gap-8">
      <p>{label}</p>
      {active ? (
        <Icon className="text-accent size-7" path={mdiCheckCircleOutline} />
      ) : (
        <Icon className="text-tertiary size-7" path={mdiCircleOutline} />
      )}
    </div>
  );
};

export default TrueFalseIndicator;
