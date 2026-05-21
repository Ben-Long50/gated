import { FormApi } from '@tanstack/react-form';
import InputSelectField from '../InputSelectField';

const RarityField = ({ form }: { form: FormApi }) => {
  return (
    <form.Field
      name="rarity"
      validators={{
        onSubmit: ({ value }) => (!value ? 'Select a rarity' : undefined),
      }}
    >
      {(field) => (
        <InputSelectField
          label={'Item Rarity'}
          options={['common', 'uncommon', 'rare', 'blackMarket', 'artifact']}
          value={field.state.value}
          onChange={(value) => field.handleChange(value)}
        />
      )}
    </form.Field>
  );
};

export default RarityField;
