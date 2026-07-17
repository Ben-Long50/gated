import { capitalCase } from 'change-case';
import ArrowHeader3 from '../ArrowHeader3';
import Icon from '@mdi/react';
import {
  mdiCircle,
  mdiCircleOutline,
  mdiMinus,
  mdiPlus,
  mdiSquare,
  mdiSquareOutline,
} from '@mdi/js';
import { useContext } from 'react';
import { LayoutContext } from 'src/contexts/LayoutContext';
import { ThemeContext } from 'src/contexts/ThemeContext';
import { FormApi, useStore } from '@tanstack/react-form';
import { AttributeTree } from 'src/types/attributeTree';
import IconBtnSmall from '../buttons/IconBtnSmall';
import ThemeContainer from '../ThemeContainer';
import { getAttributePoints, getSkillPoints } from 'src/utils/getUsedPoints';
import { combineAttributeTrees } from 'src/utils/combineAttributeTrees';

const AttributeField = ({
  form,
  attributeTree,
  attributeIncrease = true,
  attributeDecrease = true,
  skillIncrease = true,
  skillDecrease = true,
}: {
  form: FormApi;
  attributeTree?: AttributeTree;
  attributeIncrease?: boolean;
  attributeDecrease?: boolean;
  skillIncrease?: boolean;
  skillDecrease?: boolean;
}) => {
  const { mobile } = useContext(LayoutContext);
  const { accentPrimary } = useContext(ThemeContext);

  return (
    <form.Field name="attributes">
      {(field) => {
        const combinedTree = combineAttributeTrees([
          attributeTree,
          field.state.value,
        ]);

        return (
          <div className="flex w-full grow flex-col gap-4 lg:grid lg:grid-cols-2 lg:gap-8">
            {Object.keys(combinedTree)
              .sort((a, b) => a.localeCompare(b))
              .map((attribute) => (
                <form.Field key={attribute} name={`attributes[${attribute}]`}>
                  {(subfield) => {
                    const attributePoints = getAttributePoints(
                      combinedTree,
                      attribute,
                    );

                    return (
                      <ThemeContainer
                        chamfer="medium"
                        borderColor={accentPrimary}
                      >
                        <div className="flex flex-col gap-4 p-4">
                          <div className="flex w-full items-center justify-between gap-8">
                            <ArrowHeader3 title={capitalCase(attribute)} />
                            <div className="flex items-center gap-2 sm:gap-4">
                              <IconBtnSmall
                                active={
                                  (attributeDecrease ||
                                    attributePoints >
                                      getAttributePoints(
                                        attributeTree,
                                        attribute,
                                      )) &&
                                  subfield.state.value.points > 0
                                }
                                onClick={() => {
                                  if (subfield.state.value.points > 0) {
                                    subfield.handleChange({
                                      ...subfield.state.value,
                                      points: subfield.state.value.points - 1,
                                    });
                                  }
                                }}
                              >
                                <Icon path={mdiMinus} />
                              </IconBtnSmall>
                              {Array.from({ length: 4 }).map((_, index) =>
                                mobile ? (
                                  index < attributePoints ? (
                                    <Icon
                                      key={index}
                                      path={mdiCircle}
                                      size={0.7}
                                      color={accentPrimary}
                                    />
                                  ) : (
                                    <Icon
                                      key={index}
                                      path={mdiCircleOutline}
                                      size={0.7}
                                      color={accentPrimary}
                                    />
                                  )
                                ) : index < attributePoints ? (
                                  <Icon
                                    key={index}
                                    path={mdiSquare}
                                    size={1}
                                    color={accentPrimary}
                                  />
                                ) : (
                                  <Icon
                                    key={index}
                                    path={mdiSquareOutline}
                                    size={1}
                                    color={accentPrimary}
                                  />
                                ),
                              )}
                              <IconBtnSmall
                                active={
                                  (attributeIncrease ||
                                    getAttributePoints(
                                      attributeTree,
                                      attribute,
                                    ) > attributePoints) &&
                                  subfield.state.value.points < 4
                                }
                                onClick={() => {
                                  if (subfield.state.value.points < 4) {
                                    subfield.handleChange({
                                      ...subfield.state.value,
                                      points: subfield.state.value.points + 1,
                                    });
                                  }
                                }}
                              >
                                <Icon path={mdiPlus} />
                              </IconBtnSmall>
                            </div>
                          </div>

                          <div>
                            <div className="flex flex-col gap-2 border-l-2 border-gray-400 border-opacity-50 pl-4">
                              {Object.keys(subfield.state.value.skills)
                                .sort((a, b) => a.localeCompare(b))
                                .map((skill) => (
                                  <div
                                    key={skill}
                                    className="flex items-center justify-between gap-4"
                                  >
                                    <h4>{capitalCase(skill)}</h4>
                                    <form.Field
                                      name={`attributes[${attribute}].skills[${skill}].points`}
                                    >
                                      {(subSubfield) => {
                                        const skillPoints = getSkillPoints(
                                          combinedTree,
                                          skill,
                                        );

                                        return (
                                          <div className="flex items-center gap-2 sm:gap-4">
                                            <IconBtnSmall
                                              active={
                                                (skillDecrease ||
                                                  getSkillPoints(
                                                    attributeTree,
                                                    skill,
                                                  ) < skillPoints) &&
                                                subSubfield.state.value > 0
                                              }
                                              onClick={() => {
                                                if (
                                                  subSubfield.state.value > 0
                                                ) {
                                                  subSubfield.handleChange(
                                                    subSubfield.state.value - 1,
                                                  );
                                                }
                                              }}
                                            >
                                              <Icon path={mdiMinus} />
                                            </IconBtnSmall>
                                            {Array.from({ length: 4 }).map(
                                              (_, index) =>
                                                mobile ? (
                                                  index < skillPoints ? (
                                                    <Icon
                                                      className="text-primary"
                                                      key={index}
                                                      path={mdiCircle}
                                                      size={0.7}
                                                    />
                                                  ) : (
                                                    <Icon
                                                      className="text-tertiary"
                                                      key={index}
                                                      path={mdiCircleOutline}
                                                      size={0.7}
                                                    />
                                                  )
                                                ) : index < skillPoints ? (
                                                  <Icon
                                                    className="text-primary"
                                                    key={index}
                                                    path={mdiSquare}
                                                    size={1}
                                                  />
                                                ) : (
                                                  <Icon
                                                    className="text-tertiary"
                                                    key={index}
                                                    path={mdiSquareOutline}
                                                    size={1}
                                                  />
                                                ),
                                            )}
                                            <IconBtnSmall
                                              active={
                                                (skillIncrease ||
                                                  getSkillPoints(
                                                    attributeTree,
                                                    skill,
                                                  ) > skillPoints) &&
                                                subSubfield.state.value < 4
                                              }
                                              onClick={() => {
                                                if (
                                                  subSubfield.state.value < 4
                                                ) {
                                                  subSubfield.handleChange(
                                                    subSubfield.state.value + 1,
                                                  );
                                                }
                                              }}
                                            >
                                              <Icon path={mdiPlus} />
                                            </IconBtnSmall>
                                          </div>
                                        );
                                      }}
                                    </form.Field>
                                  </div>
                                ))}
                            </div>
                          </div>
                        </div>
                      </ThemeContainer>
                    );
                  }}
                </form.Field>
              ))}
          </div>
        );
      }}
    </form.Field>
  );
};

export default AttributeField;
