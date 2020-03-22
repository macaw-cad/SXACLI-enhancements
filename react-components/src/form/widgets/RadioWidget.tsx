import React from "react";
import { FormControlLabel, Radio, FormLabel, RadioGroup } from "@material-ui/core";
import { WidgetProps } from "react-jsonschema-form";

export const RadioWidget: React.FC<WidgetProps> = ({
  id,
  schema,
  options,
  value,
  required,
  disabled,
  readonly,
  label,
  onChange,
  onBlur,
  onFocus,
}) => {

  const name = Math.random().toString();
  const { enumOptions, enumDisabled } = options;

  const _onChange = (obj: any, value: any) =>
    onChange(schema.type === 'boolean' ? value !== 'false' : value);
  const _onBlur = ({ target: { value } }: React.FocusEvent<HTMLInputElement>) =>
    onBlur(id, value);
  const _onFocus = ({
    target: { value },
  }: React.FocusEvent<HTMLInputElement>) => onFocus(id, value);

  const row = options ? options.inline : false;

  return (
    <>
    <FormLabel htmlFor={id} required={required}>{label || schema.title}</FormLabel>
      <RadioGroup
        name={name}
        value={`${value}`}
        row={row as boolean}
        onChange={_onChange}
        onBlur={_onBlur}
        onFocus={_onFocus}
      >
        {(enumOptions as any).map((option: any, i: number) => {
          const itemDisabled =
            enumDisabled && (enumDisabled as any).indexOf(option.value) !== -1;

          const radio = (
            <FormControlLabel
              control={<Radio color="primary" key={i} />}
              label={`${option.label}`}
              value={`${option.value}`}
              key={i}
              disabled={disabled || itemDisabled || readonly}
            />
          );

          return radio;
        })}
      </RadioGroup>
    </>  
  );
}