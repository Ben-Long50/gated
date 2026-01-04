import { useContext, useRef, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { socket } from 'src/socket';

const useEncounterArrows = () => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { combat, removeTarget, setTarget, getTarget } =
    useContext(EncounterContext);

  const isDraggingRef = useRef(false);
  const keyRef = useRef<string | null>(null);

  const handleDragStart = (row: number, col: number, characterId?: number) => {
    isDraggingRef.current = true;

    const key = characterId ? `character ${characterId}` : `user ${user.id}`;
    keyRef.current = key;

    const targetData = {
      start: {
        row,
        col,
        characterId,
      },
      end: {
        row,
        col,
      },
      distance: 0,
      color: accentPrimary,
      occupied: false,
      inRange: true,
    };

    setTarget(key, targetData);

    socket.emit('changeTarget', {
      encounterId: combat.id,
      key,
      targetData,
    });
  };

  const handleDragUpdate = (row: number, col: number, targetId?: number) => {
    if (!isDraggingRef.current) {
      return;
    }

    const key = keyRef.current;
    if (!key) {
      return;
    }

    const data = getTarget(key);

    const targetData = {
      ...data,
      end: {
        row,
        col,
        targetId,
      },
      distance: Math.round(
        Math.sqrt((col - data.start.col) ** 2 + (row - data.end.row) ** 2),
      ),
      color: accentPrimary,
      occupied: targetId,
      inRange: true,
    };

    setTarget(key, targetData);

    socket.emit('changeTarget', {
      encounterId: combat.id,
      key,
      targetData,
    });
  };

  const handleDragEnd = () => {
    const key = keyRef.current;
    if (!key) {
      return;
    }

    isDraggingRef.current = false;
    keyRef.current = null;
  };

  const handleRemoveTarget = (characterId?: number) => {
    const key = characterId ? `character ${characterId}` : `user ${user.id}`;
    removeTarget(key);
  };

  return {
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
    handleRemoveTarget,
    isDragging: isDraggingRef.current,
  };
};

export default useEncounterArrows;
