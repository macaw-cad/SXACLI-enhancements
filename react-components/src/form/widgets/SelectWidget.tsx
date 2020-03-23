import React from 'react';

import FormControl from '@material-ui/core/FormControl';
import MenuItem from '@material-ui/core/MenuItem';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';

import { asNumber, guessType } from "react-jsonschema-form/lib/utils";
import { WidgetProps } from 'react-jsonschema-form';

const nums = new Set(['number', 'integer']);

/**
 * This is a silly limitation in the DOM where option change event values are
 * always retrieved as strings.
 */
const processValue = (schema: any, value: any) => {
  // "enum" is a reserved word, so only "type" and "items" can be destructured
  const { type, items } = schema;
  if (value === '') {
    return undefined;
  } else if (type === 'array' && items && nums.has(items.type)) {
    return value.map(asNumber);
  } else if (type === 'boolean') {
    return value === 'true';
  } else if (type === 'number') {
    return asNumber(value);
  }

  // If type is undefined, but an enum is present, try and infer the type from
  // the enum values
  if (schema.enum) {
    if (schema.enum.every((x: any) => guessType(x) === 'number')) {
      return asNumber(value);
    } else if (schema.enum.every((x: any) => guessType(x) === 'boolean')) {
      return value === 'true';
    }
  }

  return value;
};

type Props = WidgetProps & {
  required?: boolean;
  multiple?: boolean;
  rawErrors?: string;
}

export const SelectWidget = ({
  schema,
  id,
  options,
  label,
  required,
  disabled,
  readonly,
  value,
  multiple,
  autofocus,
  onChange,
  onBlur,
  onFocus,
  rawErrors
}: Props) => {
  const { enumOptions, enumDisabled } = options;
  const emptyValue: string | string[] = multiple ? [] : '';

  const _onChange = ({
    target: { value },
  }: React.ChangeEvent<{ name?: string; value: unknown }>) =>
    onChange(processValue(schema, value));
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, processValue(schema, value));
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) =>
    onFocus(id, processValue(schema, value));

  return (
    <FormControl
      fullWidth={true}
      required={required}
      variant="outlined"
    >
      <InputLabel htmlFor={id}>
        {label || schema.title}
      </InputLabel>
      <Select
        labelId={id}
        multiple={typeof multiple === 'undefined' ? false : multiple}
        value={typeof value === 'undefined' ? emptyValue : value}
        required={required}
        disabled={disabled || readonly}
        autoFocus={autofocus}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
        error={!!rawErrors}
        label={label}
      >
        {(enumOptions as any).map(({ value, label }: any, i: number) => {
          const disabled: any =
            enumDisabled && (enumDisabled as any).indexOf(value) !== -1;
          return (
            <MenuItem key={i} value={value} disabled={disabled}>
              {label}
            </MenuItem>
          );
        })}
      </Select>
    </FormControl>
  );
};

export default SelectWidget;