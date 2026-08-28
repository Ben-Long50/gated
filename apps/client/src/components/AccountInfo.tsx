import Loading from './Loading';

import { useNavigate, useParams } from 'react-router-dom';
import useUserQuery from 'src/hooks/user hooks/useUserQuery';
import BtnRect from './buttons/BtnRect';
import { useContext } from 'react';
import { AuthContext } from 'src/contexts/AuthContext';
import AccountPicture from './AccountPicture';
import Divider from './Divider';
import userLimits from 'src/utils/constants/userLimits';
import ArrowHeader3 from './ArrowHeader3';

const AccountInfo = () => {
  const { user } = useContext(AuthContext);
  const { userId } = useParams();
  const navigate = useNavigate();

  const { data: account, isLoading } = useUserQuery(Number(userId));

  const limits = userLimits[account?.role];

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

  if (isLoading) return <Loading />;

  return (
    <>
      <ArrowHeader3 title="Membership Info" />

      <div className="flex items-center justify-between gap-4">
        <p>Membership Level</p>
        <p>{limits.roleName}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p>Characters</p>
        <p>
          {playerCharacters.length} / {limits.playerCharacters}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p>Character Inventory Size</p>
        <p>{limits.playerCharacterTotalItems}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p>Total Inventory Items</p>
        <p>
          {playerCharacterItemCount} / {limits.playerCharacterTotalItems}
        </p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p>Owner Campaign Limit</p>
        <p>{limits.ownerCampaigns}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p>Player Campaign Limit</p>
        <p>{limits.playerCampaigns}</p>
      </div>
      <div className="flex items-center justify-between gap-4">
        <p>Campaign Player Limit</p>
        <p>{limits.campaignPlayers}</p>
      </div>
      <Divider />
      <ArrowHeader3 title="Account Info" />
      <div className="gap-18 flex w-full items-center justify-between">
        <p>Username</p>
        <p>{account?.username}</p>
      </div>
      <div className="gap-18 flex w-full items-center justify-between">
        <p>Profile Picture</p>
        <AccountPicture user={account} />
      </div>
      <div className="gap-18 flex w-full items-center justify-between">
        <p>First Name</p>
        <p>{account?.firstName}</p>
      </div>
      <div className="gap-18 flex w-full items-center justify-between">
        <p>Last Name</p>
        <p>{account?.lastName}</p>
      </div>
      <div className="gap-18 flex w-full items-center justify-between">
        <p>Email</p>
        <p>{account?.email}</p>
      </div>
      {user.id === Number(userId) && (
        <BtnRect
          ariaLabel="Update account info"
          onClick={() => navigate('update')}
        >
          Update Account Info
        </BtnRect>
      )}
    </>
  );
};

export default AccountInfo;
