import { useContext } from 'react';
import CharacterList from './CharacterList';
import { AuthContext } from 'src/contexts/AuthContext';
import userLimits from 'src/utils/userLimits';
import ArrowHeader3 from './ArrowHeader3';
import Divider from './Divider';
import ArrowHeader4 from './ArrowHeader4';
import Container from './Container';

const CharacterDashboard = () => {
  const { user } = useContext(AuthContext);

  const limits = userLimits[user.role];

  const playerCharacters = user.characters.filter(
    (character) => character.playerCharacter,
  );

  const playerCharacterItemCount = playerCharacters.reduce(
    (sum, character) =>
      character.characterInventory
        ? character.characterInventory._count.items + sum
        : 0,
    0,
  );

  const nonPlayerCharacters = user.characters.filter(
    (character) => !character.playerCharacter,
  );

  const nonPlayerCharacterItemCount = nonPlayerCharacters.reduce(
    (sum, character) =>
      character.characterInventory
        ? character.characterInventory._count.items + sum
        : 0,
    0,
  );

  return (
    <div className="flex w-full max-w-8xl flex-col items-center gap-8">
      <h1 className="text-center">Characters</h1>
      <Container>
        <div className="flex w-full flex-col gap-4">
          <ArrowHeader3 title="Character Limits" />
          <div className="flex items-center justify-between gap-4">
            <p>Membership Level</p>
            <p>{limits.roleName}</p>
          </div>
          <Divider />
          <ArrowHeader4 className="text-primary" title="Player Characters" />
          <div className="flex items-center justify-between gap-4">
            <p>Characters</p>
            <p>
              {playerCharacters.length} / {limits.playerCharacters}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p>Inventory Size</p>
            <p>{limits.playerCharacterTotalItems}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p>Total Inventory Items</p>
            <p>
              {playerCharacterItemCount} / {limits.playerCharacterTotalItems}
            </p>
          </div>
          <Divider />
          <ArrowHeader4
            className="text-primary"
            title="Non-Player Characters"
          />
          <div className="flex items-center justify-between gap-4">
            <p>Characters</p>
            <p>
              {nonPlayerCharacters.length} / {limits.nonPlayerCharacters}
            </p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p>Inventory Size</p>
            <p>{limits.playerCharacterTotalItems}</p>
          </div>
          <div className="flex items-center justify-between gap-4">
            <p>Total Inventory Items</p>
            <p>
              {nonPlayerCharacterItemCount} / {limits.playerCharacterTotalItems}
            </p>
          </div>
        </div>
        <Divider />
        <CharacterList />
      </Container>
    </div>
  );
};

export default CharacterDashboard;
