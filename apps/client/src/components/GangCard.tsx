import { useContext } from 'react';
import ThemeContainer from './ThemeContainer';
import { ThemeContext } from '../contexts/ThemeContext';
import BtnRect from './buttons/BtnRect';
import { Link, useNavigate } from 'react-router-dom';
import { Character } from 'src/types/character';
import CharacterCardSmall from './CharacterCardSmall';
import ArrowHeader2 from './ArrowHeader2';
import Divider from './Divider';
import ArrowHeader3 from './ArrowHeader3';

const GangCard = ({ gang }: { gang: Gang }) => {
  const { accentPrimary } = useContext(ThemeContext);
  const navigate = useNavigate();

  return (
    <ThemeContainer
      className="w-full"
      chamfer="large"
      borderColor={accentPrimary}
      bgImageUrl={gang.picture}
      overflowHidden={true}
    >
      <div className="flex flex-col items-center gap-8 p-6 md:flex-row">
        <div className="absolute inset-0 bg-white bg-opacity-70 dark:bg-black dark:opacity-80" />
        <div className="z-10 flex h-full w-full flex-col justify-between gap-4 md:gap-6">
          <div className="flex flex-col gap-4">
            <div className="flex w-full items-center justify-between">
              <ArrowHeader2 title={gang.name} />
              <h2 className="!text-accent">{gang.level}</h2>
            </div>
            <div className="flex w-full flex-col items-start gap-2">
              <p>{`Gang Points ${gang.gangPoints}`}</p>
              <p>{`Profits ${gang.profits}`}</p>
            </div>

            <Divider className="opacity-50" />
            <ArrowHeader3 title="Characters" />
            {gang.characters.map((character: Character) => (
              <CharacterCardSmall
                key={character.id}
                characterId={character.id}
                characterList={true}
                expanding={false}
                active={false}
              />
            ))}
          </div>
          <Link to={`${gang.id}`}>
            <BtnRect ariaLabel="navigate to gang information w-full ">
              Gang Info
            </BtnRect>
          </Link>
        </div>
      </div>
    </ThemeContainer>
  );
};

export default GangCard;
