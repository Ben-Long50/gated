import {
  mdiAlphaGCircleOutline,
  mdiAlphaSCircleOutline,
  mdiAlphaTCircleOutline,
} from '@mdi/js';
import Icon from '@mdi/react';

const NpcTypeList = ({ npcTypes = [] }: { npcTypes?: string[] }) => {
  return npcTypes.length > 0 ? (
    <div className="flex items-center gap-2">
      {npcTypes.includes('shop') && (
        <Icon
          className="text-primary"
          path={mdiAlphaSCircleOutline}
          size={1.25}
        />
      )}
      {npcTypes.includes('goon') && (
        <Icon
          className="text-primary"
          path={mdiAlphaGCircleOutline}
          size={1.25}
        />
      )}
      {npcTypes.includes('template') && (
        <Icon
          className="text-primary"
          path={mdiAlphaTCircleOutline}
          size={1.25}
        />
      )}
    </div>
  ) : null;
};

export default NpcTypeList;
