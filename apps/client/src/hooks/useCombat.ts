import { useEffect, useState } from 'react';

const useCombat = (characterIds: number[]) => {
  const [turnOrder, setTurnOrder] = useState<number[]>(characterIds);

  useEffect(() => {
    if (characterIds) {
      setTurnOrder(characterIds);
    }
  }, [characterIds]);

  return { turnOrder, setTurnOrder };
};

export default useCombat;
