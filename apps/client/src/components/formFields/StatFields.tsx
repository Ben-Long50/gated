import { FormApi, useStore } from '@tanstack/react-form';
import InputField from './InputField';
import ArrowHeader2 from '../ArrowHeader2';
import Divider from '../Divider';

const StatFields = ({ form }: { form: FormApi }) => {
  const itemTypes = useStore(form.store, (state) => state.values.itemTypes);

  return (
    <>
      <Divider />
      <ArrowHeader2 title="Stats" />
      {!itemTypes || itemTypes.length === 0 ? (
        <p>Select at least 1 Item Type</p>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {itemTypes.includes('cybernetic') && (
            <>
              <form.Field name="stats.cyber">
                {(field) => (
                  <InputField
                    type="number"
                    label="Cyber"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.power">
                {(field) => (
                  <InputField
                    type="number"
                    label="Power"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
            </>
          )}
          {itemTypes.includes('weapon') && (
            <>
              <form.Field name="stats.damage">
                {(field) => (
                  <InputField
                    type="number"
                    label="Damage"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.sanityDamage">
                {(field) => (
                  <InputField
                    type="number"
                    label="Sanity Damage"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.salvo">
                {(field) => (
                  <InputField
                    type="number"
                    label="Salvo"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.flurry">
                {(field) => (
                  <InputField
                    type="number"
                    label="Flurry"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.range">
                {(field) => (
                  <InputField
                    type="number"
                    label="Range"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.magCapacity">
                {(field) => (
                  <InputField
                    type="number"
                    label="Mag. capacity"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.magCount">
                {(field) => (
                  <InputField
                    type="number"
                    label="Mag. count"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              {!itemTypes.includes('cybernetic') && (
                <form.Field name="stats.power">
                  {(field) => (
                    <InputField
                      type="number"
                      label="Power"
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                </form.Field>
              )}
              {!itemTypes.includes('cybernetic') && (
                <form.Field name="stats.weight">
                  {(field) => (
                    <InputField
                      type="number"
                      label="Weight"
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                </form.Field>
              )}
            </>
          )}
          {itemTypes.includes('armor') && (
            <>
              <form.Field name="stats.armor">
                {(field) => (
                  <InputField
                    type="number"
                    label="Armor value"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.ward">
                {(field) => (
                  <InputField
                    type="number"
                    label="Ward value"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.block">
                {(field) => (
                  <InputField
                    type="number"
                    label="Block points"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              {!itemTypes.includes('cybernetic') && (
                <form.Field name="stats.power">
                  {(field) => (
                    <InputField
                      type="number"
                      label="Power"
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                </form.Field>
              )}
              {!itemTypes.includes('cybernetic') && (
                <form.Field name="stats.weight">
                  {(field) => (
                    <InputField
                      type="number"
                      label="Weight"
                      value={field.state.value}
                      onChange={(value) => field.handleChange(value)}
                    />
                  )}
                </form.Field>
              )}
            </>
          )}
          {itemTypes.includes('drone') && (
            <>
              <form.Field name="stats.hull">
                {(field) => (
                  <InputField
                    type="number"
                    label="Hull"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.armor">
                {(field) => (
                  <InputField
                    type="number"
                    label="Armor"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.power">
                {(field) => (
                  <InputField
                    type="number"
                    label="Power"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.speed">
                {(field) => (
                  <InputField
                    type="number"
                    label="Speed"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.weight">
                {(field) => (
                  <InputField
                    type="number"
                    label="Weight"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
            </>
          )}
          {itemTypes.includes('vehicle') && (
            <>
              <form.Field name="stats.size">
                {(field) => (
                  <InputField
                    type="number"
                    label="Size"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.speed">
                {(field) => (
                  <InputField
                    type="number"
                    label="Speed"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.agility">
                {(field) => (
                  <InputField
                    type="number"
                    label="Agility"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.hull">
                {(field) => (
                  <InputField
                    type="number"
                    label="Hull"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.armor">
                {(field) => (
                  <InputField
                    type="number"
                    label="Armor"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.cargo">
                {(field) => (
                  <InputField
                    type="number"
                    label="Cargo"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.pass">
                {(field) => (
                  <InputField
                    type="number"
                    label="Occupants"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.turret">
                {(field) => (
                  <InputField
                    type="number"
                    label="Turrets"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.weapon">
                {(field) => (
                  <InputField
                    type="number"
                    label="Weapons"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
            </>
          )}
          {itemTypes.includes('modification') && (
            <>
              <form.Field name="stats.range">
                {(field) => (
                  <InputField
                    type="number"
                    label="Range"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
            </>
          )}
          {itemTypes.includes('reusable') && (
            <>
              <form.Field name="stats.power">
                {(field) => (
                  <InputField
                    type="number"
                    label="Power"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.range">
                {(field) => (
                  <InputField
                    type="number"
                    label="Range"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.speed">
                {(field) => (
                  <InputField
                    type="number"
                    label="Speed"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.wyrmMoldSlots">
                {(field) => (
                  <InputField
                    type="number"
                    label="Wyrm Mold Slots"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.wyrmMoldPoints">
                {(field) => (
                  <InputField
                    type="number"
                    label="Wyrm Mold Points"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.esotericCharges">
                {(field) => (
                  <InputField
                    type="number"
                    label="Esoteric Charges"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.weight">
                {(field) => (
                  <InputField
                    type="number"
                    label="Weight"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
            </>
          )}
          {itemTypes.includes('consumable') && (
            <>
              <form.Field name="stats.range">
                {(field) => (
                  <InputField
                    type="number"
                    label="Range"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
              <form.Field name="stats.weight">
                {(field) => (
                  <InputField
                    type="number"
                    label="Weight"
                    value={field.state.value}
                    onChange={(value) => field.handleChange(value)}
                  />
                )}
              </form.Field>
            </>
          )}
        </div>
      )}
    </>
  );
};

export default StatFields;
