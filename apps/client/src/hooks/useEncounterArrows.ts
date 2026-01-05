import { useContext, useRef, useState } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import { EncounterContext } from 'src/contexts/EncounterContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { socket } from 'src/socket';

type TargetData = {
  start: {
    row: number;
    col: number;
    characterId?: number;
  };
  end: {
    row: number;
    col: number;
    targetId?: number;
  };
  distance: number;
  color: string;
  occupied: boolean;
  inRange: boolean;
};

const useEncounterArrows = () => {
  const { user } = useContext(AuthContext);
  const { accentPrimary } = useContext(ThemeContext);
  const { combat, removeTarget, setTarget } = useContext(EncounterContext);

  const isDraggingRef = useRef(false);
  const keyRef = useRef<string | null>(null);
  const targetRef = useRef<TargetData | null>(null);

  const handleInsertArrow = (
    row: number,
    col: number,
    characterId: number,
    targetRow: number,
    targetCol: number,
    targetId: number,
    inRange: boolean,
  ) => {
    const key = characterId ? `character ${characterId}` : `user ${user.id}`;

    removeTarget(key);

    const targetData = {
      start: {
        row,
        col,
        characterId,
      },
      end: {
        row: targetRow,
        col: targetCol,
        targetId,
      },
      distance: Math.round(
        Math.sqrt((targetCol - col) ** 2 + (targetRow - row) ** 2),
      ),
      color: accentPrimary,
      occupied: false,
      inRange,
    };

    setTarget(key, targetData);
  };

  const handleDragStart = (row: number, col: number, characterId?: number) => {
    isDraggingRef.current = true;

    const key = characterId ? `character ${characterId}` : `user ${user.id}`;
    keyRef.current = key;

    removeTarget(key);

    const targetData = {
      start: {
        row,
        col,
        characterId,
      },
      end: {
        row,
        col: col + 2,
      },
      distance: 0,
      color: accentPrimary,
      occupied: false,
      inRange: true,
    };

    targetRef.current = targetData;
  };

  const handleDragUpdate = (
    row: number,
    col: number,
    targetId?: number,
    inRange?: boolean | null,
  ) => {
    if (!isDraggingRef.current) {
      return;
    }

    const key = keyRef.current;
    if (!key) {
      return;
    }

    const data = targetRef.current;

    if (!data) {
      return;
    }

    const targetData = {
      ...data,
      end: {
        row,
        col,
        targetId,
      },
      distance: Math.round(
        Math.sqrt((col - data.start.col) ** 2 + (row - data.start.row) ** 2),
      ),
      color: accentPrimary,
      occupied: !!targetId,
      inRange,
    };

    targetRef.current = targetData;
    setTarget(key, targetData);
  };

  const handleDragEnd = () => {
    const key = keyRef.current;
    const targetData = targetRef.current;
    if (!key || !targetData) {
      return;
    }

    setTarget(key, targetData);

    socket.emit('changeTarget', {
      encounterId: combat.id,
      key,
      targetData,
    });

    isDraggingRef.current = false;
    keyRef.current = null;
    targetRef.current = null;
  };

  const handleRemoveTarget = (characterId?: number) => {
    const key = characterId ? `character ${characterId}` : `user ${user.id}`;
    removeTarget(key);
  };

  return {
    isDragging: isDraggingRef.current,
    handleInsertArrow,
    handleDragStart,
    handleDragUpdate,
    handleDragEnd,
    handleRemoveTarget,
  };
};

export default useEncounterArrows;
