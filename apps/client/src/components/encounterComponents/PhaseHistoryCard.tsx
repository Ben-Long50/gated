import { PhaseHistory } from 'src/types/encounter';
import ArrowHeader3 from '../ArrowHeader3';
import PhaseActionCard from './PhaseActionCard';
import Divider from '../Divider';
import ItemCardSmall from '../ItemCardSmall';
import Icon from '@mdi/react';
import { mdiTriangleDown } from '@mdi/js';
import ActionIcon from '../icons/ActionIcon';
import CharacterPictureRound from '../CharacterPictureRound';
import ReactionIcon from '../icons/ReactionIcon';
import parsePhaseAction from 'src/utils/parsePhaseAction';
import ArrowHeader4 from '../ArrowHeader4';
import { Fragment } from 'react/jsx-runtime';
import SanityDamageIcon from '../icons/SanityDamageIcon';
import DamageIcon from '../icons/DamageIcon';
import WardIcon from '../icons/WardIcon';
import ArmorIcon from '../icons/ArmorIcon';

const PhaseHistoryCard = ({ phaseHistory }: { phaseHistory: PhaseHistory }) => {
  const phaseAction = phaseHistory.action || null;
  const phaseReactions = phaseHistory.reactions || null;

  const actionQueueResults = parsePhaseAction(
    phaseHistory,
    phaseAction.blockData,
  );

  return (
    <div className="flex w-full items-center gap-4">
      <ItemCardSmall
        heading={
          <div className="flex items-center gap-8">
            <h2>{phaseHistory.turn}</h2>
            <Icon
              className="text-primary"
              path={mdiTriangleDown}
              rotate={-90}
              size={0.5}
            />
            <div className="flex items-center gap-4">
              <ActionIcon className="size-8" />
              <CharacterPictureRound
                className="size-9"
                character={phaseAction.characterSnapshot}
              />
              <p>{phaseAction.actionSnapshot.name}</p>
            </div>
            {phaseReactions.length > 0 && (
              <div className="flex items-center gap-4">
                <ReactionIcon className="size-8" />
                {phaseReactions.map((reaction) => {
                  return (
                    <Fragment key={reaction.id}>
                      <CharacterPictureRound
                        className="size-9"
                        character={reaction.characterSnapshot}
                      />
                      <p>{reaction.actionSnapshot.name}</p>
                    </Fragment>
                  );
                })}
              </div>
            )}
          </div>
        }
      >
        <div className="flex flex-col gap-4">
          <ArrowHeader3 title="Action" className="self-start" />
          <PhaseActionCard phaseAction={phaseAction} />

          {phaseReactions.length > 0 && (
            <>
              <Divider className="opacity-50" />
              <ArrowHeader3 title="Reactions" className="self-start" />
              {phaseReactions.map((phaseReaction) => {
                return (
                  <PhaseActionCard
                    key={phaseReaction.id}
                    phaseAction={phaseReaction}
                  />
                );
              })}
            </>
          )}
          {actionQueueResults.damage + actionQueueResults.sanityDamage > 0 && (
            <div className="flex w-full flex-col gap-4">
              <>
                <Divider className="opacity-50" />
                <div className="flex w-full flex-col gap-4">
                  {actionQueueResults.blockedDamage > 0 && (
                    <div className="mt-2 flex w-full items-center justify-between px-2">
                      <ArrowHeader4
                        className="text-secondary"
                        title="Blocked Damage"
                      />
                      <div className="flex items-center gap-2">
                        <ArmorIcon className="text-primary size-6" />
                        <h3 className="flex size-6 items-center justify-center">
                          {actionQueueResults.blockedDamage}
                        </h3>
                        {actionQueueResults.blockedDamage >
                          actionQueueResults.damage && (
                          <h3 className="text-tertiary text-base">
                            (
                            {actionQueueResults.blockedDamage -
                              actionQueueResults.damage}
                            )
                          </h3>
                        )}
                      </div>
                    </div>
                  )}
                  {actionQueueResults.blockedSanityDamage > 0 && (
                    <div className="mt-2 flex w-full items-center justify-between px-2">
                      <ArrowHeader4
                        className="text-secondary"
                        title="Blocked Sanity Damage"
                      />
                      <div className="flex items-center gap-2">
                        <WardIcon className="text-primary size-6" />
                        <h3 className="flex size-6 items-center justify-center">
                          {actionQueueResults.blockedSanityDamage}
                        </h3>
                        {actionQueueResults.blockedSanityDamage >
                          actionQueueResults.sanityDamage && (
                          <h3 className="text-tertiary text-base">
                            (
                            {actionQueueResults.blockedSanityDamage -
                              actionQueueResults.sanityDamage}
                            )
                          </h3>
                        )}
                      </div>
                    </div>
                  )}
                  {actionQueueResults.damage > 0 && (
                    <div className="flex w-full items-center justify-between">
                      <ArrowHeader3 title="Final Damage" />
                      <div className="flex items-center gap-4">
                        <DamageIcon className="text-primary size-8" />
                        <h2 className="flex size-6 items-center justify-center">
                          {actionQueueResults.damage *
                            actionQueueResults.resultingInstances -
                            actionQueueResults.blockedDamage >
                          0
                            ? actionQueueResults.damage *
                                actionQueueResults.resultingInstances -
                              actionQueueResults.blockedDamage
                            : 0}
                        </h2>
                      </div>
                    </div>
                  )}
                  {actionQueueResults.sanityDamage > 0 && (
                    <div className="flex w-full items-center justify-between">
                      <ArrowHeader3 title="Final Sanity Damage" />
                      <div className="flex items-center gap-4">
                        <SanityDamageIcon className="text-primary size-8" />
                        <h2 className="flex size-6 items-center justify-center">
                          {actionQueueResults.sanityDamage *
                            actionQueueResults.resultingInstances -
                            actionQueueResults.blockedSanityDamage >
                          0
                            ? actionQueueResults.sanityDamage *
                                actionQueueResults.resultingInstances -
                              actionQueueResults.blockedSanityDamage
                            : 0}
                        </h2>
                      </div>
                    </div>
                  )}
                </div>
              </>
            </div>
          )}
        </div>
      </ItemCardSmall>
    </div>
  );
};

export default PhaseHistoryCard;
